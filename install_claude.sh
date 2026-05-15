#!/usr/bin/env bash
set -eo pipefail

echo "=== Step 1: Clone nvm ==="
if [ -d "$HOME/.nvm" ]; then
  echo "nvm already present at $HOME/.nvm, skipping clone"
else
  git clone --depth 1 --branch v0.40.1 https://github.com/nvm-sh/nvm.git "$HOME/.nvm"
fi

echo "=== Step 2: Load nvm ==="
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

echo "=== Step 3: Install Node LTS ==="
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

echo "=== Step 4: Versions ==="
node --version
npm --version

echo "=== Step 5: Install Claude Code ==="
npm install -g @anthropic-ai/claude-code

echo "=== Step 6: Verify Claude ==="
claude --version || true
which claude

echo "=== DONE ==="
