#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" = "0" ]; then
  echo "Running as root - installing tools via apt-get..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq git curl jq
else
  echo "Running as non-root - downloading tools to ~/.local/bin"
  mkdir -p "$HOME/.local/bin"
  if ! command -v jq >/dev/null 2>&1; then
    echo "Downloading jq..."
    curl -sL "https://github.com/jqlang/jq/releases/download/jq-${JQ_VERSION}/jq-linux-amd64" -o "$HOME/.local/bin/jq"
    chmod +x "$HOME/.local/bin/jq"
  fi
fi

if ! command -v gum >/dev/null 2>&1; then
  echo "Installing gum..."
  mkdir -p "$HOME/.local/bin"
  curl -sL "https://github.com/charmbracelet/gum/releases/download/v${GUM_VERSION}/gum_${GUM_VERSION}_Linux_x86_64.tar.gz" | tar -xz -C /tmp
  mv /tmp/gum "$HOME/.local/bin/gum" 2>/dev/null || mv /tmp/gum_*/gum "$HOME/.local/bin/gum" 2>/dev/null
  chmod +x "$HOME/.local/bin/gum" 2>/dev/null || echo "gum not available"
fi

export PATH="$HOME/.local/bin:$PATH"
echo "Tools ready: $(which git) $(which curl) $(which jq) $(which gum 2>/dev/null || echo 'no-gum')"
