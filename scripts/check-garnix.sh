#!/bin/bash
set -euo pipefail

SHA="${CI_COMMIT_SHA}"
REPO="${GITHUB_REPO}"
API="https://api.github.com"
AUTH="Authorization: Bearer ${GITHUB_TOKEN}"
ACCEPT="Accept: application/vnd.github+json"
UA="User-Agent: gitlab-github-all-checks-gate"

timeout_s="${GITHUB_CHECK_TIMEOUT}"
interval_s="${GITHUB_CHECK_INTERVAL}"

# Build a jq predicate for OK_CONCLUSIONS
ok_list_json="$(printf '%s' "${OK_CONCLUSIONS}" | awk -v RS=',' 'NF{gsub(/^[ \t]+|[ \t]+$/, "", $0); print}' | jq -R . | jq -s .)"

# Print nice header
echo ""
gum style --foreground 212 --border-foreground 212 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
  "🔍 Checking Your Code! 🔍" \
  "" \
  "We're looking at commit:" \
  "${SHA:0:8}" \
  "" \
  "Making sure everything works perfectly!"
echo ""

fetch_check_suites() {
  local http_code
  http_code=$(curl -fsSL -w "%{http_code}" -H "${AUTH}" -H "${ACCEPT}" -H "${UA}" \
    -o /tmp/check_suites.json \
    "${API}/repos/${REPO}/commits/${SHA}/check-suites" 2>/dev/null || echo "000")
  echo "${http_code}"
}

fetch_combined_status() {
  local http_code
  http_code=$(curl -fsSL -w "%{http_code}" -H "${AUTH}" -H "${ACCEPT}" -H "${UA}" \
    -o /tmp/status.json \
    "${API}/repos/${REPO}/commits/${SHA}/status" 2>/dev/null || echo "000")
  echo "${http_code}"
}

handle_api_error() {
  local http_code="$2"
  case "${http_code}" in
  404 | 422)
    gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "🤔 Can't Find Your Code!" \
      "" \
      "We looked for your code on GitHub but couldn't find it." \
      "" \
      "This usually means:" \
      "• The code hasn't been sent to GitHub yet" \
      "• We're checking too fast (computers are quick!)" \
      "" \
      "Please wait a moment and try again!"
    exit 1
    ;;
  401 | 403)
    gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "🔒 Permission Denied!" \
      "" \
      "The (GITHUB_TOKEN) doesn't have permission to check the code." \
      "" \
      "Please:" \
      "1. Check the token is correct" \
      "2. Make sure it can read GitHub checks" \
      "3. Update it in GitLab settings"
    exit 1
    ;;
  000)
    gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "🌐 Connection Problem!" \
      "" \
      "We can't reach GitHub right now." \
      "" \
      "This might be because:" \
      "• The internet is having a nap" \
      "• GitHub is busy" \
      "• A network problem" \
      "" \
      "Let's try again in a moment!"
    exit 1
    ;;
  esac
}

# Function to extract Garnix check runs and print nice output
process_check_suites() {
  local suites_json="$1"

  # Check if Garnix is one of the check suites
  if echo "${suites_json}" | jq -e '.check_suites[] | select(.app.slug == "garnix-ci" or .app.name | contains("Garnix"))' >/dev/null 2>&1; then
    echo ""
    gum style --foreground 141 --border-foreground 141 --border normal --margin "1 0" --padding "0 2" \
      "🤖 Found Garnix CI - Your Nix Builder!"
    echo ""
  fi

  # Print each check suite nicely
  echo "${suites_json}" | jq -c '.check_suites[]' | while read -r suite; do
    local app_name status conclusion check_suite_id
    app_name=$(echo "${suite}" | jq -r '.app.slug // .app.name // "unknown"')
    status=$(echo "${suite}" | jq -r '.status')
    conclusion=$(echo "${suite}" | jq -r '.conclusion // "still running"')
    check_suite_id=$(echo "${suite}" | jq -r '.id // ""')

    # Build GitHub check URL
    local web_url=""
    if [ -n "${check_suite_id}" ]; then
      web_url="https://github.com/${REPO}/commit/${SHA}/checks"
    fi

    local icon="🔄"
    local color=39

    case "${status}" in
    completed)
      case "${conclusion}" in
      success)
        icon="✅"
        color=82
        ;;
      failure)
        icon="❌"
        color=196
        ;;
      *)
        icon="⚠️"
        color=220
        ;;
      esac
      ;;
    *)
      icon="⏳"
      color=39
      ;;
    esac

    gum style --foreground "${color}" "  ${icon} ${app_name}: ${conclusion}"

    # Special handling for Garnix with build log links
    if [[ ${app_name} == *"garnix"* ]] || [[ ${app_name} == *"Garnix"* ]]; then
      if [ -n "${web_url}" ]; then
        echo ""
        gum style --foreground 141 "     📋 View full build logs:"
        gum style --foreground 87 "        ${web_url}"
        echo ""
      fi
    fi
  done
}

start_ts="$(date +%s)"

while true; do
  now_ts="$(date +%s)"
  elapsed="$((now_ts - start_ts))"

  if [ "${elapsed}" -ge "${timeout_s}" ]; then
    echo ""
    gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "⏰ Time's Up!" \
      "" \
      "We waited a long time (${timeout_s} seconds) but the checks are still running." \
      "" \
      "This might mean:" \
      "• The checks are taking a really long time" \
      "• Something might be stuck" \
      "" \
      "You can check the status yourself at:" \
      "https://github.com/${REPO}/commit/${SHA}"
    exit 1
  fi

  # Show progress message (CI-friendly, no TTY required)
  echo "⏳ Checking GitHub for updates..."

  # 1) Checks API: check suites
  suites_http="$(fetch_check_suites)"
  handle_api_error "check_suites" "${suites_http}"
  suites_json="$(cat /tmp/check_suites.json)"
  suite_total="$(echo "${suites_json}" | jq -r '.total_count // 0')"

  if [ "${suite_total}" -gt 0 ]; then
    process_check_suites "${suites_json}"

    # Any suites still running?
    suites_incomplete="$(echo "${suites_json}" | jq '[.check_suites[] | select(.status != "completed")] | length')"
    if [ "${suites_incomplete}" -gt 0 ]; then
      echo ""
      gum style --foreground 39 "⏳ ${suites_incomplete} check(s) still running... waiting ${interval_s} seconds"
      echo ""
      sleep "${interval_s}"
      continue
    fi

    # Any suite concluded with a failing conclusion?
    suites_bad="$(echo "${suites_json}" | jq --argjson ok "${ok_list_json}" '
      [ .check_suites[]
        | select((.conclusion // "null") as $c | ($ok | index($c) | not))
      ] | length
    ')"

    if [ "${suites_bad}" -gt 0 ]; then
      echo ""
      gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
        "❌ Oh No! Some Checks Failed!" \
        "" \
        "${suites_bad} check(s) didn't pass. This means something needs to be fixed." \
        "" \
        "Don't worry! Here's what to do:" \
        "1. Click the links above to see what went wrong" \
        "2. Read the error messages" \
        "3. Fix the problems in your code" \
        "4. Try again!" \
        "" \
        "Hint: Try 'nix flake check' locally to reproduce this."

      echo ""
      gum style --foreground 196 "Failed checks:"

      echo "${suites_json}" | jq --argjson ok "${ok_list_json}" -c '
        .check_suites[]
        | select((.conclusion // "null") as $c | ($ok | index($c) | not))
      ' | while read -r failed_suite; do
        app_name=$(echo "${failed_suite}" | jq -r '.app.slug // .app.name // "unknown"')
        conclusion=$(echo "${failed_suite}" | jq -r '.conclusion // "unknown"')

        gum style --foreground 196 "  ❌ ${app_name}: ${conclusion}"

        # Provide link for Garnix failures
        if [[ ${app_name} == *"garnix"* ]] || [[ ${app_name} == *"Garnix"* ]]; then
          gum style --foreground 141 "     🔍 See what went wrong: https://github.com/${REPO}/commit/${SHA}/checks"
        fi
      done

      echo ""
      exit 1
    fi

    echo ""
    gum style --foreground 82 --border-foreground 82 --border normal --margin "1 0" --padding "0 2" \
      "🎉 All individual checks passed!"
    echo ""

    # Success! All check suites passed, we can exit now
    echo ""
    gum style --foreground 82 --border-foreground 82 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "🎊 Success! 🎊" \
      "" \
      "All your code checks passed!" \
      "" \
      "This means:" \
      "✅ Your code looks good" \
      "✅ Everything is working properly" \
      "✅ You're ready to go!" \
      "" \
      "Great work! 🌟"

    echo ""
    gum style --foreground 141 "📋 View all check details:"
    gum style --foreground 87 "   https://github.com/${REPO}/commit/${SHA}/checks"
    echo ""

    exit 0
  else
    echo ""
    gum style --foreground 39 "ℹ️  No check suites found yet - they might still be starting up..."
    echo ""
  fi

  # 2) Status API: combined status (covers classic contexts)
  status_http="$(fetch_combined_status)"
  handle_api_error "status" "${status_http}"
  status_json="$(cat /tmp/status.json)"
  state="$(echo "${status_json}" | jq -r '.state')"

  case "${state}" in
  success)
    echo ""
    gum style --foreground 82 --border-foreground 82 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "🎊 Success! 🎊" \
      "" \
      "All your code checks passed!" \
      "" \
      "This means:" \
      "✅ Your code looks good" \
      "✅ Everything is working properly" \
      "✅ You're ready to go!" \
      "" \
      "Great work! 🌟"

    echo ""
    gum style --foreground 141 "📋 View all check details:"
    gum style --foreground 87 "   https://github.com/${REPO}/commit/${SHA}/checks"
    echo ""

    exit 0
    ;;
  pending)
    echo ""
    gum style --foreground 39 "⏳ Still waiting for some checks..."
    echo ""
    sleep "${interval_s}"
    ;;
  failure | error)
    echo ""
    gum style --foreground 196 --border-foreground 196 --border double --align center --width 60 --margin "1 2" --padding "2 4" \
      "😢 Something Went Wrong" \
      "" \
      "The overall status is: ${state}" \
      "" \
      "This means one or more checks had problems." \
      "Check the details above to see what needs fixing!" \
      "" \
      "📋 See details: https://github.com/${REPO}/commit/${SHA}/checks"

    exit 1
    ;;
  *)
    echo ""
    gum style --foreground 196 "❌ Unexpected status: ${state}"
    exit 2
    ;;
  esac
done
