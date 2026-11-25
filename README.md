# Thème Shopify TURLUTTE

Thème Liquid sur mesure (Online Store 2.0), relié à la boutique par l'intégration GitHub de Shopify.
Cette branche ne contient que le thème : Shopify y réécrit `config/settings_data.json` et les `templates/*.json` quand on modifie le thème dans l'éditeur.

- DA : crème #F6F1E4, bleu profond #0E2239, phosphore #DDF56A ; Libre Caslon Display et Text (fichiers dans `assets/`).
- Jour / nuit : `data-state` sur `<html>`, nuit de 21 h à 6 h (heure du visiteur), choix mémorisé. Interrupteur dans l'en-tête, fil en bonus sur ordinateur. Prix, tailles, boutons et panier ne changent jamais.
- Visuels : tant qu'une image manque, `snippets/visuel.liquid` affiche un emplacement nommé (« Packshot face, jour », 4:5…).
- Le Vice : produits tagués `vice`, collection `le-vice` (gabarit `collection.vice`), page `le-vice` (gabarit `page.vice`). Accès si le client porte le tag `vice-invite` ; le formulaire crée un client tagué `vice-attente`. Le blocage au paiement demande une fonction de validation (à faire).

## Metafields attendus (espace `custom`)
Produit : `vestiaire`, `phrase_jour`, `chute_nuit`, `packshot_nuit_face` (fichier), `packshot_nuit_dos` (fichier), `matiere_origine`, `coupe`, `entretien` (texte riche ou multiligne).
Collection : `accroche`, `image_nuit` (fichier).

Le SKU du doc 10 (`TRL-I01-FRE-BRPC-C002-M`) est la clé de liaison avec AJDN.
