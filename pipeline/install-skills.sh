#!/usr/bin/env bash
# Copies the agent skills the video builder uses into .claude/skills/ (where
# Claude Code picks them up), each with its source's license. The copies are
# committed; run this again to update them.
#
#   bash pipeline/install-skills.sh
set -euo pipefail

# repo                  skill folder under skills/   license file (repo:path)
SKILLS=(
  "remotion-dev/skills  remotion-best-practices  remotion-dev/remotion:LICENSE.md"
  "remotion-dev/skills  remotion-markup          remotion-dev/remotion:LICENSE.md"
  "anthropics/skills    frontend-design          -"
  "emilkowalski/skills  emil-design-eng          emilkowalski/skills:LICENSE"
  "emilkowalski/skills  animate                  emilkowalski/skills:LICENSE"
  "remotion-dev/skills  remotion-captions        remotion-dev/remotion:LICENSE.md"
  "remotion-dev/skills  remotion-maps            remotion-dev/remotion:LICENSE.md"
  "emilkowalski/skills  review-animations        emilkowalski/skills:LICENSE"
  "emilkowalski/skills  animation-performance    emilkowalski/skills:LICENSE"
  "emilkowalski/skills  apple-design             emilkowalski/skills:LICENSE"
  "emilkowalski/skills  animation-vocabulary     emilkowalski/skills:LICENSE"
  "anthropics/skills    theme-factory            -"
)

dest=".claude/skills"
mkdir -p "$dest"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

notice="$dest/NOTICE.md"
{
  echo "# Third-party skills"
  echo
  echo "Copied by \`pipeline/install-skills.sh\`, unmodified, for building this"
  echo "project's videos. Each folder keeps its source's license."
  echo
  echo "| Skill | Source | License |"
  echo "| --- | --- | --- |"
} > "$notice"

for entry in "${SKILLS[@]}"; do
  read -r repo skill license <<<"$entry"
  dir="$tmp/${repo//\//-}"
  if [ ! -d "$dir" ]; then
    git clone --quiet --depth 1 --filter=blob:none --sparse "https://github.com/$repo.git" "$dir"
  fi
  git -C "$dir" sparse-checkout add "skills/$skill"
  rm -rf "${dest:?}/$skill"
  cp -r "$dir/skills/$skill" "$dest/$skill"

  name="included in the folder"
  if [ "$license" != "-" ]; then
    src="${license%%:*}"
    path="${license#*:}"
    curl -fsSL "https://raw.githubusercontent.com/$src/HEAD/$path" -o "$dest/$skill/$(basename "$path")"
    name="$(basename "$path") from $src"
  fi
  echo "| $skill | https://github.com/$repo/tree/HEAD/skills/$skill | $name |" >> "$notice"
  echo "skill: $skill ($repo)"
done

# Skills copied from this machine's ~/.agents/skills, which have no repo to
# fetch from here: only their SKILL.md, data and Python scripts.
for skill in ui-ux-pro-max; do
  src="$HOME/.agents/skills/$skill"
  [ -d "$src" ] || { echo "skip: $skill (not in ~/.agents/skills)"; continue; }
  rm -rf "${dest:?}/$skill"
  mkdir -p "$dest/$skill/scripts"
  cp -r "$src/SKILL.md" "$src/data" "$dest/$skill/"
  cp "$src"/scripts/*.py "$dest/$skill/scripts/"
  echo "| $skill | copied from the maintainer's local \`~/.agents/skills/$skill\` (SKILL.md, data, scripts) | as published by its authors |" >> "$notice"
  echo "skill: $skill (local)"
done

# The humanizer's rules, which pipeline/humanize.mjs adapts for the script pass:
# its repo keeps the skill at the root.
mkdir -p "$dest/humanizer"
for file in SKILL.md LICENSE; do
  curl -fsSL "https://raw.githubusercontent.com/blader/humanizer/HEAD/$file" -o "$dest/humanizer/$file"
done
echo "| humanizer | https://github.com/blader/humanizer | LICENSE from blader/humanizer (MIT) |" >> "$notice"
echo "skill: humanizer (blader/humanizer)"
