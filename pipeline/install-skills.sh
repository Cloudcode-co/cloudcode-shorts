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

# Seeded, constrained composition (Markov melodies, voice leading) for music
# made by code; its repo keeps skills under distributions/claude/skills.
music="$dest/generative-music-composer"
mkdir -p "$music/references"
base="https://raw.githubusercontent.com/4444j99/a-i--skills/HEAD"
curl -fsSL "$base/distributions/claude/skills/generative-music-composer/SKILL.md" -o "$music/SKILL.md"
for ref in markov-music midi-reference music-theory-primer workflow-integration; do
  curl -fsSL "$base/distributions/claude/skills/generative-music-composer/references/$ref.md" -o "$music/references/$ref.md"
done
curl -fsSL "$base/LICENSE" -o "$music/LICENSE"
echo "| generative-music-composer | https://github.com/4444j99/a-i--skills/tree/HEAD/distributions/claude/skills/generative-music-composer | SKILL.md says MIT; repo LICENSE (Apache-2.0) in the folder |" >> "$notice"
echo "skill: generative-music-composer (4444j99/a-i--skills)"

# Composition theory and craft (CC BY 4.0 text, MIT scripts), read with
# generative-music-composer; its repo keeps the skill at the root, next to
# benchmarks and READMEs that are left out.
rm -rf "${dest:?}/music-composition"
git clone --quiet --depth 1 https://github.com/SJY051/music-composition.git "$tmp/music-composition"
mkdir -p "$dest/music-composition"
for f in SKILL.md LICENSE.md KNOWN-LIMITATIONS.md references assets scripts; do
  cp -r "$tmp/music-composition/$f" "$dest/music-composition/"
done
echo "| music-composition | https://github.com/SJY051/music-composition (commit 07cecf9); SKILL.md, KNOWN-LIMITATIONS.md, references/, assets/, scripts/ copied unmodified, benchmarks and maintainer docs left out | LICENSE.md in the folder: CC BY 4.0 for the text, MIT for scripts/. Based on \"Music Composition Agent Skill\", licensed under CC BY 4.0 |" >> "$notice"
echo "skill: music-composition (SJY051/music-composition)"

# archify, copied from ~/.agents/skills: the runtime files only (Node
# built-ins, no npm install), without its 13 MB of pre-rendered example pages,
# brand-mark sources and generator scripts.
src="$HOME/.agents/skills/archify"
if [ -d "$src" ]; then
  rm -rf "${dest:?}/archify"
  mkdir -p "$dest/archify/scripts" "$dest/archify/examples"
  for f in SKILL.md LICENSE LICENSE-MIT NOTICE THIRD_PARTY_NOTICES.md package.json skill-release.json; do
    cp "$src/$f" "$dest/archify/"
  done
  for d in bin renderers schemas references explainer delta locales assets recipes migrations; do
    cp -r "$src/$d" "$dest/archify/"
  done
  for f in check-update.mjs delivery-update-child.mjs check-render-output.mjs; do
    cp "$src/scripts/$f" "$dest/archify/scripts/"
  done
  cp "$src"/examples/*.json "$dest/archify/examples/"
  cp -r "$src/examples/locales" "$dest/archify/examples/"
  echo "| archify | https://github.com/tt-a1i/archify, copied from the maintainer's local \`~/.agents/skills/archify\` (runtime files only) | LICENSE (Apache-2.0) and LICENSE-MIT in the folder |" >> "$notice"
  echo "skill: archify (local)"
else
  echo "skip: archify (not in ~/.agents/skills)"
fi
