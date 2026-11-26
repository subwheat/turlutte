@AGENTS.md

## Spécifique à Claude Code
- Tu travailles dans ce dépôt (subwheat), pas dans le dossier de marque TURLUTTE.
- Branche et worktree : `git worktree add ~/Worktrees/subwheat/claude-<sujet> -b claude/<sujet>`.
- Chrome : vérifier le rendu du thème en prévisualisation. Ne te connecte à aucun compte et n'achète rien.
- Les hooks (`.claude/settings.json`) bloquent l'écriture dans `.git/` et les commandes `git push --force`, `git reset --hard`, ainsi que le push ou le merge vers `main` ou `shopify-theme` (y compris `gh pr merge`). Si tu es bloqué, arrête-toi et demande à Julien.
- Julien seul merge les PR.
