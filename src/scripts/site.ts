import { parSlug, prix } from '../data/catalogue';

declare global {
  interface Window { __aller?: (chemin: string) => void }
}

const racine = document.documentElement;

/* Le fil */
const SEUIL = 56;
const COURSE_MAX = 120;
const bouton = document.querySelector<HTMLButtonElement>('[data-fil]')!;
const consigne = document.querySelector<HTMLElement>('[data-fil-consigne]')!;
const etat = () => (racine.dataset.state === 'nuit' ? 'nuit' : 'jour');

function afficherFil() {
  const nuit = etat() === 'nuit';
  bouton.setAttribute('aria-pressed', String(nuit));
  bouton.setAttribute('aria-label', nuit ? 'Passer au jour' : 'Passer à la nuit');
  consigne.textContent = nuit ? 'Rallumer' : 'Tirer le fil';
}

function ecrire(cle: string, valeur: string) {
  try { localStorage.setItem(cle, valeur); } catch { /* Stockage indisponible. */ }
}

function basculer() {
  const suivant = etat() === 'nuit' ? 'jour' : 'nuit';
  const appliquer = () => {
    racine.dataset.state = suivant;
    afficherFil();
    rendre();
  };
  ecrire('turlutte-etat', suivant);
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calme && 'startViewTransition' in document) document.startViewTransition(appliquer);
  else appliquer();
}

let depart: number | null = null;
let course = 0;
let aGlisse = false;

bouton.addEventListener('pointerdown', (e) => {
  depart = e.clientY;
  course = 0;
  aGlisse = false;
  bouton.setPointerCapture(e.pointerId);
  bouton.classList.add('fil--tire');
});
bouton.addEventListener('pointermove', (e) => {
  if (depart === null) return;
  course = Math.max(0, Math.min(COURSE_MAX, e.clientY - depart));
  if (course > 4) aGlisse = true;
  bouton.style.setProperty('--tirage', `${course}px`);
});
function relacher() {
  if (depart === null) return;
  depart = null;
  bouton.classList.remove('fil--tire');
  bouton.style.setProperty('--tirage', '0px');
  if (course >= SEUIL) basculer();
}
bouton.addEventListener('pointerup', relacher);
bouton.addEventListener('pointercancel', () => { course = 0; relacher(); });
bouton.addEventListener('click', () => {
  if (aGlisse) { aGlisse = false; return; }
  basculer();
});

/* Le panier */
type Ligne = { slug: string; taille: string; qte: number };

function lirePanier(): Ligne[] {
  try {
    const brut = JSON.parse(localStorage.getItem('turlutte-panier') ?? '[]');
    if (!Array.isArray(brut)) return [];
    return brut.filter((l) => parSlug(l?.slug) && Number.isInteger(l?.qte) && l.qte > 0);
  } catch {
    return memoire;
  }
}
let memoire: Ligne[] = [];
function ecrirePanier(lignes: Ligne[]) {
  memoire = lignes;
  ecrire('turlutte-panier', JSON.stringify(lignes));
  rendre();
}

function rendrePanier() {
  const lignes = lirePanier();
  const nombre = lignes.reduce((n, l) => n + l.qte, 0);
  document.querySelectorAll('[data-compteur]').forEach((el) => { el.textContent = `(${nombre})`; });

  const zone = document.querySelector<HTMLElement>('[data-panier]');
  if (!zone) return;
  const vide = document.querySelector<HTMLElement>('[data-panier-vide]')!;
  const plein = document.querySelector<HTMLElement>('[data-panier-plein]')!;
  vide.hidden = lignes.length > 0;
  plein.hidden = lignes.length === 0;
  zone.replaceChildren(...lignes.map((l, i) => {
    const p = parSlug(l.slug)!;
    const ligne = document.createElement('li');
    ligne.className = 'ligne';
    const nom = document.createElement('a');
    nom.href = `/produit/${p.slug}/`;
    nom.className = 'ligne__nom';
    nom.textContent = l.taille && l.taille !== '-' ? `${p.nom}, taille ${l.taille}` : p.nom;
    const moins = document.createElement('button');
    moins.type = 'button';
    moins.textContent = '−';
    moins.setAttribute('aria-label', `Retirer un exemplaire de ${p.nom}`);
    moins.dataset.quantite = `${i}:-1`;
    const qte = document.createElement('span');
    qte.textContent = String(l.qte);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.setAttribute('aria-label', `Ajouter un exemplaire de ${p.nom}`);
    plus.dataset.quantite = `${i}:1`;
    const quantite = document.createElement('span');
    quantite.className = 'ligne__quantite';
    quantite.append(moins, qte, plus);
    const montant = document.createElement('span');
    montant.className = 'ligne__prix';
    montant.textContent = prix(p.prix * l.qte);
    ligne.append(nom, quantite, montant);
    return ligne;
  }));
  const total = lignes.reduce((n, l) => n + parSlug(l.slug)!.prix * l.qte, 0);
  document.querySelectorAll('[data-total]').forEach((el) => { el.textContent = prix(total); });
}

function rendre() {
  rendrePanier();
  const total = document.querySelector('[data-resume-paiement]');
  if (total) total.textContent = prix(lirePanier().reduce((n, l) => n + parSlug(l.slug)!.prix * l.qte, 0));
}

document.addEventListener('click', (e) => {
  const cible = e.target as HTMLElement;

  const menu = cible.closest<HTMLElement>('[data-menu]');
  const nav = document.querySelector('#nav')!;
  if (menu) {
    const ouvert = nav.classList.toggle('nav--ouvert');
    menu.setAttribute('aria-expanded', String(ouvert));
    return;
  }
  if (cible.closest('#nav a')) {
    nav.classList.remove('nav--ouvert');
    document.querySelector('[data-menu]')!.setAttribute('aria-expanded', 'false');
  }

  const retourner = cible.closest<HTMLElement>('[data-retourner]');
  if (retourner) {
    const fiche = retourner.closest<HTMLElement>('[data-vue]')!;
    const actuelle = fiche.dataset.vue === 'auto' ? (etat() === 'nuit' ? 'dos' : 'devant') : fiche.dataset.vue;
    fiche.dataset.vue = actuelle === 'dos' ? 'devant' : 'dos';
    return;
  }

  const quantite = cible.closest<HTMLElement>('[data-quantite]');
  if (quantite) {
    const [i, delta] = quantite.dataset.quantite!.split(':').map(Number);
    const lignes = lirePanier();
    lignes[i].qte += delta;
    ecrirePanier(lignes.filter((l) => l.qte > 0));
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;

  if (form.matches('[data-ajout]')) {
    e.preventDefault();
    const donnees = new FormData(form);
    const slug = String(donnees.get('slug'));
    const taille = String(donnees.get('taille') ?? '-');
    const lignes = lirePanier();
    const existante = lignes.find((l) => l.slug === slug && l.taille === taille);
    if (existante) existante.qte += 1;
    else lignes.push({ slug, taille, qte: 1 });
    ecrirePanier(lignes);
    const retour = form.querySelector<HTMLElement>('[data-confirmation]')!;
    retour.hidden = false;
    return;
  }

  if (form.matches('[data-paiement]')) {
    e.preventDefault();
    ecrirePanier([]);
    if (window.__aller) window.__aller('/merci/');
    else location.assign('/merci/');
  }
});

document.addEventListener('turlutte:page', rendre);

afficherFil();
rendre();
