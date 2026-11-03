#!/usr/bin/env bash
# Commits a finished video's source on top of the latest main and pushes it.
# Other runs may have pushed meanwhile, and every run appends to
# pipeline/history.json and regenerates src/videos/index.ts, so those two are
# rebuilt on top of main instead of rebased: this run's history entries are
# appended to main's, and the index is generated again.
#
#   SLUG=<slug> TOKEN=<github token> scripts/save-video.sh
set -euo pipefail

remote="https://x-access-token:${TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
branch="${GITHUB_REF_NAME:-main}"
mine="$(mktemp)"
cp pipeline/history.json "$mine"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add "src/videos/$SLUG" "public/videos/$SLUG"
git checkout -- pipeline/history.json src/videos/index.ts

for attempt in 1 2 3; do
  git stash push --quiet --include-untracked -- "src/videos/$SLUG" "public/videos/$SLUG" || true
  git fetch --quiet "$remote" "$branch"
  git reset --quiet --hard FETCH_HEAD
  git stash pop --quiet || true

  node -e '
    const fs = require("fs");
    const [file, mineFile] = process.argv.slice(1);
    const theirs = JSON.parse(fs.readFileSync(file, "utf8"));
    const seen = new Set(theirs.map((h) => JSON.stringify(h)));
    for (const h of JSON.parse(fs.readFileSync(mineFile, "utf8"))) {
      if (!seen.has(JSON.stringify(h))) theirs.push(h);
    }
    fs.writeFileSync(file, JSON.stringify(theirs, null, 2) + "\n");
  ' pipeline/history.json "$mine"
  node scripts/register.mjs

  git add "src/videos/$SLUG" "public/videos/$SLUG" src/videos/index.ts pipeline/history.json
  git diff --cached --quiet && exit 0
  git commit --quiet -m "Video $SLUG"
  if git push "$remote" "HEAD:$branch"; then exit 0; fi
  echo "main moved during the push; trying again ($attempt)"
  git reset --quiet --soft HEAD~1
done
exit 1
