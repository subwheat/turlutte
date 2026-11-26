/* TURLUTTE : jour / nuit, menu, fiche produit, tiroir panier. Sans dépendance. */
(() => {
  const racine = document.documentElement;
  const etat = () => (racine.dataset.state === 'nuit' ? 'nuit' : 'jour');
  const ecrire = (cle, valeur) => { try { localStorage.setItem(cle, valeur); } catch (e) { /* stockage indisponible */ } };
  const calme = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Jour / nuit ---------- */
  const fil = document.querySelector('[data-fil]');
  const consigne = document.querySelector('[data-fil-consigne]');
  const interrupteurs = document.querySelectorAll('[data-interrupteur]');

  function afficherEtat() {
    const nuit = etat() === 'nuit';
    if (fil) {
      fil.setAttribute('aria-pressed', String(nuit));
      fil.setAttribute('aria-label', nuit ? 'Passer au jour' : 'Passer à la nuit');
    }
    if (consigne) consigne.textContent = nuit ? 'Rallumer' : 'Tirer le fil';
    interrupteurs.forEach((b) => {
      b.setAttribute('aria-pressed', String(nuit));
      b.setAttribute('aria-label', nuit ? 'Passer au jour' : 'Passer à la nuit');
    });
  }

  function basculer() {
    const suivant = etat() === 'nuit' ? 'jour' : 'nuit';
    const appliquer = () => { racine.dataset.state = suivant; afficherEtat(); };
    ecrire('turlutte-etat', suivant);
    if (!calme() && 'startViewTransition' in document) document.startViewTransition(appliquer);
    else appliquer();
  }

  interrupteurs.forEach((b) => b.addEventListener('click', basculer));

  if (fil) {
    const SEUIL = 56, COURSE_MAX = 120;
    let depart = null, course = 0, aGlisse = false;
    fil.addEventListener('pointerdown', (e) => {
      depart = e.clientY; course = 0; aGlisse = false;
      fil.setPointerCapture(e.pointerId);
      fil.classList.add('fil--tire');
    });
    fil.addEventListener('pointermove', (e) => {
      if (depart === null) return;
      course = Math.max(0, Math.min(COURSE_MAX, e.clientY - depart));
      if (course > 4) aGlisse = true;
      fil.style.setProperty('--tirage', `${course}px`);
    });
    const relacher = () => {
      if (depart === null) return;
      depart = null;
      fil.classList.remove('fil--tire');
      fil.style.setProperty('--tirage', '0px');
      if (course >= SEUIL) basculer();
    };
    fil.addEventListener('pointerup', relacher);
    fil.addEventListener('pointercancel', () => { course = 0; relacher(); });
    fil.addEventListener('click', () => { if (aGlisse) { aGlisse = false; return; } basculer(); });
  }
  afficherEtat();

  /* ---------- Menu ---------- */
  document.addEventListener('click', (e) => {
    const bouton = e.target.closest('[data-menu]');
    if (!bouton) return;
    const nav = document.getElementById('nav');
    const ouvert = nav.classList.toggle('nav--ouvert');
    bouton.setAttribute('aria-expanded', String(ouvert));
  });

  /* ---------- Filtres et tri ---------- */
  document.querySelectorAll('[data-filtres]').forEach((form) => {
    form.addEventListener('change', () => {
      const params = new URLSearchParams(new FormData(form));
      for (const [cle, valeur] of [...params.entries()]) if (valeur === '') params.delete(cle);
      location.assign(`${form.action}?${params.toString()}`);
    });
  });

  /* ---------- Tiroir panier ---------- */
  const tiroirSection = () => document.querySelector('[data-tiroir]');
  let dernierFocus = null;

  function ouvrirPanier() {
    const t = tiroirSection();
    if (!t) return false;
    dernierFocus = document.activeElement;
    t.hidden = false;
    document.body.classList.add('tiroir-ouvert');
    requestAnimationFrame(() => t.classList.add('tiroir--ouvert'));
    t.querySelector('.tiroir__panneau').focus();
    return true;
  }
  function fermerPanier() {
    const t = tiroirSection();
    if (!t) return;
    t.classList.remove('tiroir--ouvert');
    document.body.classList.remove('tiroir-ouvert');
    setTimeout(() => { t.hidden = true; }, calme() ? 0 : 250);
    if (dernierFocus) dernierFocus.focus();
  }

  async function rafraichirPanier(sections) {
    let html = sections && sections['cart-drawer'];
    if (!html) {
      const r = await fetch(`${window.turlutte.routes.root_url.replace(/\/$/, '')}/?sections=cart-drawer`);
      html = (await r.json())['cart-drawer'];
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const neuf = doc.querySelector('[data-tiroir]');
    const ancien = tiroirSection();
    if (neuf && ancien) {
      ancien.querySelector('.tiroir__panneau').replaceWith(neuf.querySelector('.tiroir__panneau'));
    }
    const compte = doc.querySelector('[data-compteur]');
    if (compte) document.querySelectorAll('[data-compteur]').forEach((el) => { el.textContent = compte.textContent; });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-ouvrir-panier]')) {
      if (ouvrirPanier()) e.preventDefault();
      return;
    }
    if (e.target.closest('[data-fermer-panier]')) { fermerPanier(); return; }
    const changer = e.target.closest('[data-changer]');
    if (changer) {
      changer.disabled = true;
      fetch(`${window.turlutte.routes.cart_change_url}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: changer.dataset.changer, quantity: Number(changer.dataset.quantite), sections: ['cart-drawer'] }),
      }).then((r) => r.json()).then((d) => rafraichirPanier(d.sections)).then(() => {
        tiroirSection().querySelector('.tiroir__panneau').focus();
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('tiroir-ouvert')) fermerPanier();
  });

  /* ---------- Fiche produit ---------- */
  document.querySelectorAll('[data-achat]').forEach((form) => {
    const variantes = JSON.parse(form.querySelector('[data-variantes]').textContent);
    const champ = form.querySelector('[data-variante]');
    const bouton = form.querySelector('[data-ajouter]');
    const texte = form.querySelector('[data-texte-bouton]');
    const message = form.querySelector('[data-message]');
    const prix = document.querySelector('[data-prix]');
    const format = (c) => (c / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

    form.addEventListener('change', (e) => {
      if (!e.target.matches('[data-option]')) return;
      const choix = [...form.querySelectorAll('[data-option]:checked')].map((i) => i.value);
      const v = variantes.find((x) => x.options.every((o, i) => o === choix[i]));
      if (!v) { bouton.disabled = true; texte.textContent = 'Indisponible'; return; }
      champ.value = v.id;
      bouton.disabled = !v.available;
      texte.textContent = v.available ? 'Ajouter au panier' : 'Bientôt de retour';
      if (prix) prix.textContent = format(v.price);
      const url = new URL(location.href);
      url.searchParams.set('variant', v.id);
      history.replaceState({}, '', url);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.hidden = true;
      if (window.turlutte.unePieceParCommande) {
        const panier = await fetch(`${window.turlutte.routes.cart_url}.js`).then((r) => r.json());
        if (panier.item_count > 0) {
          message.textContent = window.turlutte.messageUnePiece;
          message.hidden = false;
          return;
        }
      }
      bouton.disabled = true;
      const r = await fetch(`${window.turlutte.routes.cart_add_url}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(champ.value), quantity: 1 }], sections: ['cart-drawer'] }),
      });
      const d = await r.json();
      bouton.disabled = false;
      if (!r.ok) { message.textContent = d.description || 'Impossible d’ajouter cette pièce.'; message.hidden = false; return; }
      await rafraichirPanier(d.sections);
      ouvrirPanier();
    });
  });

  /* ---------- Recommandations ---------- */
  document.querySelectorAll('[data-recommandations]').forEach(async (zone) => {
    if (zone.children.length) return;
    try {
      const html = await fetch(zone.dataset.url).then((r) => r.text());
      const neuf = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-recommandations]');
      if (neuf) zone.innerHTML = neuf.innerHTML;
    } catch (e) { /* rien */ }
  });
})();

/* Carrousel éditorial : défilement natif (scroll-snap), flèches et points. */
(function () {
  document.querySelectorAll('[data-carrousel]').forEach(function (racine) {
    var piste = racine.querySelector('[data-piste]');
    var diapos = Array.prototype.slice.call(piste.children);
    var points = racine.querySelectorAll('.carrousel__point');
    var prec = racine.querySelector('[data-precedent]');
    var suiv = racine.querySelector('[data-suivant]');
    function debut() { return parseFloat(getComputedStyle(piste).paddingLeft) || 0; }
    function courant() {
      var x = piste.scrollLeft + debut(), i = 0, best = Infinity;
      diapos.forEach(function (d, n) { var e = Math.abs(d.offsetLeft - x); if (e < best) { best = e; i = n; } });
      return i;
    }
    function aller(n) {
      n = Math.max(0, Math.min(diapos.length - 1, n));
      piste.scrollTo({ left: diapos[n].offsetLeft - debut(), behavior: 'smooth' });
    }
    function maj() {
      var i = courant();
      points.forEach(function (p, n) { p.classList.toggle('carrousel__point--actif', n === i); });
      if (prec) prec.disabled = piste.scrollLeft <= 2;
      if (suiv) suiv.disabled = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 2;
    }
    if (prec) prec.addEventListener('click', function () { aller(courant() - 1); });
    if (suiv) suiv.addEventListener('click', function () { aller(courant() + 1); });
    piste.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); aller(courant() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(courant() - 1); }
    });
    piste.addEventListener('scroll', function () { window.requestAnimationFrame(maj); }, { passive: true });
    window.addEventListener('resize', maj);
    maj();
  });
})();
