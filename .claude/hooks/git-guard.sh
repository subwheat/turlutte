#!/bin/bash
# git-guard.sh — bloque push --force, reset --hard, push vers main, gh pr merge.
# Ne bloque pas « git merge origin/main » sur une branche de travail (mise à jour légitime).
# Exit 2 = action bloquée.
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$CMD" ] && exit 0

if echo "$CMD" | grep -Eqi 'git[[:space:]]+push[[:space:]]+.*(--force|--force-with-lease|-f)([[:space:]]|$)'; then
  echo "Bloqué : pas de push --force. Julien seul décide d'une réécriture d'historique." >&2
  exit 2
fi
if echo "$CMD" | grep -Eqi 'git[[:space:]]+reset[[:space:]]+.*--hard'; then
  echo "Bloqué : pas de reset --hard." >&2
  exit 2
fi
if echo "$CMD" | grep -Eqi 'gh[[:space:]]+pr[[:space:]]+merge'; then
  echo "Bloqué : Julien seul merge les PR. Ouvre la PR et arrête-toi." >&2
  exit 2
fi
if echo "$CMD" | grep -Eqi 'git[[:space:]]+push([[:space:]]+[^[:space:]]+)*[[:space:]]+main([[:space:]]|$)'; then
  echo "Bloqué : ne pas pousser directement sur main. Ouvre une PR, Julien merge." >&2
  exit 2
fi
exit 0
