# Changelog

Modifications notables du thème Shopify TURLUTTE (dépôt subwheat).
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Fuseau Europe/Paris.

## [Non publié]

### Ajouté
- Page de la trend : « Karma éthylique », pièce de lancement du Vice, montrée sans prix ni panier avec la mention « Réservé aux membres du vestiaire Le Vice » et un lien vers la demande d'invitation. Les blocs « Pièce à composer » gagnent l'option « Réservée au Vice » et un champ « Vestiaire ».
- Le Vice, majeurs uniquement (D-014) : confirmation d'âge à l'entrée des pages du Vice (page, collection, fiches taguées `vice`) et case obligatoire « J'ai 18 ans ou plus » dans les formulaires de liste d'attente (page Le Vice et slide 4 de l'accueil). Les inscrits reçoivent les tags `vice-attente` et `majeur-declare`. Accès aux pièces : tag client `vice-invite` (inchangé).
- `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md` : instructions et journal du thème.
- `.githooks/commit-msg` : Conventional Commits + trailer `Agent:`.
- `.claude/` : hooks de protection (écriture dans `.git/`, commandes git dangereuses).
- `shopify-theme` (branche publiée) protégée comme `main` par `git-guard.sh`.

### Modifié
- Vestiaires (D-014) : quatre vestiaires dans l'ordre La Base, La Vertu, L'Insolence (public), Le Vice (sur invitation). La page « Les vestiaires » suit cet ordre et ne liste jamais Le Vice.
