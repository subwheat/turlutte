# AGENTS.md — thème Shopify TURLUTTE (dépôt subwheat)

Ce fichier est la source d'instructions pour ce dépôt. Le dossier de marque vit à part, sur le Mac de Julien : `/Users/julientournier/Desktop/TURLUTTE` (géré par Grok Bot). En cas de conflit sur le code du thème, ce fichier l'emporte.

Dernière révision : 2026-11-26.

## La marque en 5 lignes
- TURLUTTE : vêtements, luxe + art. Baseline : « Good manners × Bad habits ». Un peu de vertu, beaucoup de vice.
- Signe unique : l'hameçon. Le leurre est abandonné : le retirer du thème, ne plus le générer.
- Trois vestiaires : La Base, La Vertu, Le Vice. L'Insolence n'existe plus.
- Cible : bobo trentenaire, avec des profils de 20 ans pour la hype.
- Langue de travail : français. Le contenant reste de luxe (crème, marine, Libre Caslon) ; le contenu est le vice.

## Dépôt
- La racine du dépôt est la racine du thème : `assets/ config/ layout/ locales/ sections/ snippets/ templates/` (et `blocks/` / `snippets/` s'ils existent). Shopify ne connecte que les branches qui ont cette structure ; ne rien ajouter de lourd à la racine (pas d'images de packshots, pas de dossier de marque).
- Vérifier le nom de la branche par défaut (`main` ou autre) avant toute opération. Dans la suite, « main » désigne cette branche par défaut.
- Dans ce dépôt : la branche par défaut GitHub est `prototype/jour-nuit` (maquette Astro, pas un thème). Le thème vit sur `shopify-theme`, la branche connectée à Shopify et publiée : un merge dessus met le site à jour. `shopify-theme` est protégée comme `main` : pas de push direct, une PR, Julien merge.
- `main` = ce qui est publié. `staging` (à créer si elle n'existe pas encore, dans un second temps, pas dans cette PR d'organisation) = thème non publié connecté à Shopify pour tester. Julien seul fusionne dans `main`.
- Shopify commite lui-même les modifications faites dans l'éditeur du thème sur la branche connectée. Ne pas utiliser l'éditeur Shopify sur `main` sans prévenir ; sinon, `git pull` avant de travailler.

## Qui fait quoi
- Claude Code : seul à écrire et à commiter dans ce dépôt (branches `claude/<sujet>`).
- Grok Bot et ChatGPT/Codex : ne commitent pas ici. Ils déposent une proposition dans le dossier de marque (`Site/prototypes/` ou `_coordination/journal/`), Claude Code l'intègre.
- Si Julien demande explicitement à un autre agent de coder ici : branche `grok/<sujet>` ou `codex/<sujet>`, worktree dédié, PR, Julien merge.
- Personne ne touche à `/Users/julientournier/Desktop/TURLUTTE` pour y cloner ou y recopier ce dépôt, sauf accord de Julien.

## Branches et worktrees
Depuis la racine de ce dépôt :

```
git worktree add ~/Worktrees/subwheat/<agent>-<sujet> -b <agent>/<sujet> main
```

Un agent par worktree. Jamais deux agents dans le même dossier. Supprimer le worktree après fusion : `git worktree remove <dossier>`.

La branche d'organisation s'appelle `chore/agents-setup`. Ensuite, une branche par sujet : `claude/…`, `codex/…`, `grok/…`.

## Commits
- Conventional Commits : `type(scope): description`. Types : feat, fix, docs, content, style, refactor, chore. Scope : header, carrousel, fiche-produit, panier, vice…
- Trailer obligatoire : `Agent: claude` (ou `grok`, `codex`, `chatgpt`, `julien`). Le hook `.githooks/commit-msg` le vérifie. Activation locale (à relancer sur chaque clone et worktree) : `git config core.hooksPath .githooks`.
- Un commit = un sujet. Titre de 72 caractères maximum. Chemins explicites dans `git add`, jamais `git add -A`.
- Jamais de `push --force`, de `reset --hard`, de push ou de merge vers `main`. Ouvrir une PR ; Julien merge.

## Contenu de marque dans le code
- Un seul signe : l'hameçon (SVG, jamais le JPEG). Le leurre est retiré.
- Polices : Libre Caslon (fichiers `assets/caslon-*.woff2`). Palette courte : crème, marine, phosphore pour Le Vice.
- Le Vice : pas de prix, formulaire de liste d'attente. Ne rien publier sans l'accord de Julien.
- Prix, délais et stocks de la maquette sont fictifs tant que le devis AJDN n'est pas validé.
- Au plus 1 à 2 accroches visibles par visuel, sur le torse uniquement.

## Fin de session
Si le travail a un effet sur le dossier de marque, Grok Bot (ou Julien) en laisse une trace dans `_coordination/journal/` de `/Users/julientournier/Desktop/TURLUTTE`. Dans ce dépôt, le suivi visible est le CHANGELOG et la PR.
