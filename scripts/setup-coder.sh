#!/usr/bin/env bash
set -euo pipefail

echo "SWENG Automatic Nix Setup Script for Coder Machines"
echo ""
echo "Installs nix and boots a shell with 'nix' ready"
echo ""

# Number of attempts and initial delay (seconds)
MAX_ATTEMPTS=5
DELAY=2

if ! command -v nix >/dev/null; then
  echo "No nix install found, installing..."

  attempt=1
  while :; do
    echo "Attempt $attempt of $MAX_ATTEMPTS..."

    if curl -fsSL --retry 3 --retry-delay "$DELAY" \
      https://install.determinate.systems/nix | sh -s -- install --determinate --no-confirm; then
      echo "Installation succeeded."
      break
    fi

    if ((attempt >= MAX_ATTEMPTS)); then
      echo "Failed after $MAX_ATTEMPTS attempts. Exiting."
      exit 1
    fi

    ((attempt++))
    ((DELAY *= 2))
    echo "Retrying in $DELAY seconds..."
    sleep "$DELAY"
  done

  #shellcheck disable=SC1091
  . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
  sudo bash
else
  echo "Nix is already installed on this machine"
fi
