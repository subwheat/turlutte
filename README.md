# Turlutte

Le site de la marque : un front Astro, avec WooCommerce pour le catalogue, les commandes et le paiement.

Cette maquette est navigable, avec un catalogue fictif. Le paiement est simulé tant que WooCommerce n’est pas branché.

```sh
npm install
npm run dev
npm run build
```

- Le contenu du manuel est dans `src/data/manuel.ts`.
- L'état `jour` ou `nuit` est porté par `data-state` sur `<html>`.
- Sans choix mémorisé, la nuit va de 21 h à 6 h, heure du visiteur. Sans JavaScript, c'est le jour et les chutes restent visibles.
- Prix, tailles, panier et paiement devront rester identiques dans les deux états.

`npm run apercu` assemble le site en une seule page navigable pour le montrer sans hébergement.
