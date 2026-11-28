# Changelog

Modifications notables du thème Shopify TURLUTTE (dépôt subwheat).
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Fuseau Europe/Paris.

## [Non publié]

### Ajouté
- `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md` : instructions et journal du thème.
- `.githooks/commit-msg` : Conventional Commits + trailer `Agent:`.
- `.claude/` : hooks de protection (écriture dans `.git/`, commandes git dangereuses).
- `shopify-theme` (branche publiée) protégée comme `main` par `git-guard.sh`.

### Ajouté
- Le Vice, majeurs uniquement (D-014) : confirmation d'âge à l'entrée des pages du Vice (page, collection, fiches taguées `vice`) et case obligatoire « J'ai 18 ans ou plus » dans les formulaires de liste d'attente (page Le Vice et slide 4 de l'accueil). Les inscrits reçoivent les tags `vice-attente` et `majeur-declare`. Accès aux pièces : tag client `vice-invite` (inchangé).
