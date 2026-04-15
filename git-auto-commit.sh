#!/usr/bin/env sh
set -e

# Usage:
#   ./git-auto-commit.sh "요약 메시지" "상세 설명"
# Commit message will be:
#   git-auto-commit.sh 요약 메시지
#   상세 설명

COMMIT_SUMMARY="$1"
COMMIT_BODY="$2"
REMOTE="origin"
BRANCH="main"

if [ -z "$COMMIT_SUMMARY" ]; then
  echo "Usage: $0 \"commit summary\" \"commit body\""
  exit 1
fi

if [ ! -d .git ]; then
  echo "This directory is not a Git repository. Please initialize git first."
  exit 1
fi

if [ -n "$3" ]; then
  BRANCH="$3"
fi

if [ -n "$4" ]; then
  REMOTE="$4"
fi

SCRIPT_NAME=$(basename "$0")

printf "Staging all changes...\n"
git add -A

printf "Creating commit...\n"
if [ -n "$COMMIT_BODY" ]; then
  git commit -m "${SCRIPT_NAME} ${COMMIT_SUMMARY}" -m "${COMMIT_BODY}"
else
  git commit -m "${SCRIPT_NAME} ${COMMIT_SUMMARY}"
fi

printf "Pushing to %s/%s...\n" "$REMOTE" "$BRANCH"
git push "$REMOTE" "$BRANCH"

printf "Done.\n"
