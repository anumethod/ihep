#!/usr/bin/env bash
set -euo pipefail
ENVFILE="ihep/.env.local"
if [[ ! -f "$ENVFILE" ]]; then
  echo "Missing $ENVFILE" >&2
  exit 1
fi
LINE=$(grep -m1 '^GITHUB_PAT=' "$ENVFILE" || true)
if [[ -z "$LINE" ]]; then
  echo "GITHUB_PAT not found in $ENVFILE" >&2
  exit 1
fi
VAL=${LINE#GITHUB_PAT=}
VAL=${VAL#\"}; VAL=${VAL%\"}
VAL=${VAL#\'}; VAL=${VAL%\'}
SECRET_NAME="${2:-CODEQL_TOKEN}"
if [[ -n "${1:-}" ]]; then
  REPO="$1"
else
  REMOTE_URL=$(git -C ihep remote get-url origin 2>/dev/null || true)
  if [[ -n "$REMOTE_URL" ]]; then
    if [[ "$REMOTE_URL" =~ github.com[:/](.+)/(.+)(\.git)?$ ]]; then
      REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    fi
  fi
fi
if [[ -z "${REPO:-}" ]]; then
  echo "Unable to determine repository. Pass owner/repo as first argument." >&2
  exit 1
fi
gh secret set "$SECRET_NAME" --repo "$REPO" --body "$VAL"
echo "Secret $SECRET_NAME set in $REPO."