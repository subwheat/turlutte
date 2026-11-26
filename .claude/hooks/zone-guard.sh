#!/bin/bash
# zone-guard.sh — bloque l'écriture dans .git/ du dépôt subwheat.
# Exit 2 = action bloquée, le message sur stderr est renvoyé à Claude.
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

FILE_PATH="${FILE_PATH//\\//}"
if [[ "$FILE_PATH" == *"/.git/"* ]] || [[ "$FILE_PATH" == *"/.git" ]]; then
  echo "Bloqué : $FILE_PATH est dans .git/. Ne pas modifier le dépôt à la main." >&2
  exit 2
fi
exit 0
