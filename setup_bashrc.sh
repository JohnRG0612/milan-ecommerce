#!/usr/bin/env bash
set -eo pipefail

BASHRC="$HOME/.bashrc"

if grep -q 'NVM_DIR' "$BASHRC"; then
  echo "nvm init already present in $BASHRC"
else
  cat >> "$BASHRC" <<'EOF'

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
EOF
  echo "Added nvm init block to $BASHRC"
fi

echo "--- tail of .bashrc ---"
tail -8 "$BASHRC"

echo "--- verify in fresh login shell ---"
bash -lc 'node --version && npm --version && claude --version && which claude'
