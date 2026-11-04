// Assemble dist/ en une seule page navigable, pour un aperçu sans hébergement.
// Les liens internes deviennent des ancres, le reste du site tourne à l'identique.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const sortie = process.argv[2] ?? 'apercu.html';
const dist = 'dist';

function pages(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) return pages(chemin);
    return nom === 'index.html' ? [chemin] : [];
  });
}

const route = (fichier) => `/${relative(dist, fichier).replace(/index\.html$/, '')}`;
const ancre = (chemin) => chemin.replace(/^\/|\/$/g, '').replaceAll('/', '-') || 'accueil';

const photo = `data:image/jpeg;base64,${readFileSync('public/tailleur.jpg').toString('base64')}`;
const liens = (html) => html
  .replace(/href="(\/[^"]*\/|\/)"/g, (_, chemin) => `href="#${ancre(chemin)}"`)
  .replaceAll('src="/tailleur.jpg"', `src="${photo}"`);

const fichiers = pages(dist);
const coquille = readFileSync(join(dist, 'index.html'), 'utf8');
const css = readFileSync(join(dist, coquille.match(/href="(\/_astro\/[^"]+\.css)"/)[1]), 'utf8')
  .replace(/@font-face\{[^}]*\}/g, '');
const scripts = [...coquille.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const amorce = scripts.find((s) => !s[1].includes('module'))[2];
const modules = scripts
  .filter((s) => s[1].includes('module'))
  .map((s) => {
    const src = s[1].match(/src="([^"]+)"/);
    return src ? readFileSync(join(dist, src[1]), 'utf8') : s[2];
  })
  .join('\n');

const corps = (html) => html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
const principal = /<main id="contenu">([\s\S]*)<\/main>/;

const gabarits = fichiers.map((f) => {
  const html = readFileSync(f, 'utf8');
  const titre = html.match(/<title>([^<]*)<\/title>/)[1];
  return `<template data-page="${ancre(route(f))}" data-titre="${titre}">${liens(html.match(principal)[1])}</template>`;
}).join('\n');

const routeur = `
const principal = document.querySelector('#contenu');
function montrer() {
  const id = location.hash.slice(1) || 'accueil';
  if (id === 'contenu') return;
  const gabarit = document.querySelector('template[data-page="' + CSS.escape(id) + '"]')
    ?? document.querySelector('template[data-page="accueil"]');
  principal.replaceChildren(gabarit.content.cloneNode(true));
  document.title = gabarit.dataset.titre;
  scrollTo(0, 0);
  document.dispatchEvent(new CustomEvent('turlutte:page'));
}
window.__aller = (chemin) => { location.hash = chemin.replace(/^\\/|\\/$/g, '').replaceAll('/', '-') || 'accueil'; };
addEventListener('hashchange', montrer);
montrer();
`;

writeFileSync(sortie, `<title>Turlutte, la maquette</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap">
<style>${css}
body{background:var(--fond);color:var(--encre)}</style>
<script>${amorce}</script>
${liens(corps(coquille)).replace(principal, '<main id="contenu"></main>')}
${gabarits}
<script type="module">${routeur}
${modules}</script>
`);
