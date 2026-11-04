// Catalogue de maquette : pièces, prix et matières sont fictifs.
export type Forme = 'tee' | 'pull' | 'chemise' | 'mug' | 'carte' | 'affiche' | 'tote';

export type Vestiaire = { slug: string; nom: string; promesse: string; camp: string };

export const vestiaires: Vestiaire[] = [
  { slug: 'la-base', nom: 'La Base', promesse: 'Ce qu’on est.', camp: 'Good manners' },
  { slug: 'la-vertu', nom: 'La Vertu', promesse: 'Ce qu’on montre.', camp: 'Good manners' },
  { slug: 'l-insolence', nom: 'L’Insolence', promesse: 'Ce qu’on dit.', camp: 'Bad habits' },
  { slug: 'le-vice', nom: 'Le Vice', promesse: 'Ce qu’on cache.', camp: 'Bad habits' },
];

export type Produit = {
  slug: string;
  nom: string;
  rayon: string; // slug de vestiaire, ou « goodies », « baddies »
  article?: number; // numéro de l'article du manuel
  forme: Forme;
  couleur: 'creme' | 'bleu';
  prix: number;
  matiere: string;
  devant?: string;
  dos?: string;
  interieur?: string; // phrase cachée du Vice
  tailles?: string[];
};

const T = ['XS', 'S', 'M', 'L', 'XL'];

export const produits: Produit[] = [
  { slug: 't-shirt-creme', nom: 'Le t-shirt crème', rayon: 'la-base', article: 7, forme: 'tee', couleur: 'creme', prix: 55, matiere: 'Coton épais [à confirmer]', tailles: T },
  { slug: 't-shirt-bleu', nom: 'Le t-shirt bleu', rayon: 'la-base', article: 7, forme: 'tee', couleur: 'bleu', prix: 55, matiere: 'Coton épais [à confirmer]', tailles: T },
  { slug: 'sweat-bleu', nom: 'Le sweat bleu', rayon: 'la-base', article: 1, forme: 'pull', couleur: 'bleu', prix: 110, matiere: 'Molleton [à confirmer]', tailles: T },
  { slug: 'chemise-creme', nom: 'La chemise', rayon: 'la-vertu', article: 5, forme: 'chemise', couleur: 'creme', prix: 140, matiere: 'Popeline [à confirmer]', tailles: T },
  { slug: 'pull-creme', nom: 'Le pull crème', rayon: 'la-vertu', article: 11, forme: 'pull', couleur: 'creme', prix: 180, matiere: 'Laine [à confirmer]', tailles: T },
  { slug: 'un-peu', nom: 'Un peu', rayon: 'l-insolence', article: 8, forme: 'tee', couleur: 'creme', prix: 65, matiere: 'Coton épais [à confirmer]', devant: 'On ne dit pas « drogue ».', dos: 'On dit « un peu ».', tailles: T },
  { slug: 'capitalisme', nom: 'Capitalisme', rayon: 'l-insolence', article: 4, forme: 'tee', couleur: 'bleu', prix: 65, matiere: 'Coton épais [à confirmer]', devant: 'Un héritier ne parle jamais d’héritage.', dos: 'Il parle de capitalisme.', tailles: T },
  { slug: 'consultant', nom: 'Consultant', rayon: 'l-insolence', article: 2, forme: 'tee', couleur: 'creme', prix: 65, matiere: 'Coton épais [à confirmer]', devant: 'Jusqu’à quarante ans, on dit « je me cherche ».', dos: 'Ensuite, on dit « consultant ».', tailles: T },
  { slug: 'pervers-narcissique', nom: 'Pervers narcissique', rayon: 'l-insolence', forme: 'tee', couleur: 'bleu', prix: 65, matiere: 'Coton épais [à confirmer]', devant: 'Pervers narcissique', tailles: T },
  { slug: 'pull-derniere-connexion', nom: 'Le pull du dimanche', rayon: 'le-vice', article: 10, forme: 'pull', couleur: 'bleu', prix: 190, matiere: 'Laine [à confirmer]', interieur: 'On vérifie la dernière connexion.', tailles: T },
  { slug: 'chemise-week-end', nom: 'La chemise du lundi', rayon: 'le-vice', article: 3, forme: 'chemise', couleur: 'bleu', prix: 150, matiere: 'Popeline [à confirmer]', interieur: 'On n’écoute pas. On était là.', tailles: T },
  { slug: 'mug-lundi', nom: 'Le mug du lundi', rayon: 'goodies', article: 3, forme: 'mug', couleur: 'creme', prix: 22, matiere: 'Céramique [à confirmer]', devant: 'Le week-end s’est bien passé ?', dos: 'On était là.' },
  { slug: 'carte-fin-du-monde', nom: 'Carte postale', rayon: 'goodies', article: 12, forme: 'carte', couleur: 'creme', prix: 4, matiere: 'Papier épais [à confirmer]', devant: 'À la fin du monde, on arrive en retard', dos: 'et on apporte une bouteille.' },
  { slug: 'affiche-taxi', nom: 'L’affiche du taxi', rayon: 'goodies', article: 11, forme: 'affiche', couleur: 'bleu', prix: 35, matiere: 'Papier mat [à confirmer]', devant: 'On ne juge personne.', dos: 'On attend d’être dans le taxi.' },
  { slug: 'tote-megeve', nom: 'Le tote Megève', rayon: 'baddies', forme: 'tote', couleur: 'creme', prix: 28, matiere: 'Coton [à confirmer]', devant: 'Papa a un chalet à Megève.' },
  { slug: 'mug-18-cm', nom: 'Le mug 18 cm', rayon: 'baddies', forme: 'mug', couleur: 'bleu', prix: 22, matiere: 'Céramique [à confirmer]', devant: '18 cm' },
  { slug: 'carte-body-count', nom: 'Carte body count', rayon: 'baddies', article: 9, forme: 'carte', couleur: 'bleu', prix: 4, matiere: 'Papier épais [à confirmer]', devant: 'Autrefois, on mentait sur sa dot.', dos: 'Aujourd’hui, sur son body count.' },
];

export const parSlug = (slug: string) => produits.find((p) => p.slug === slug);
export const duRayon = (rayon: string) => produits.filter((p) => p.rayon === rayon);
export const prix = (n: number) => `${n.toLocaleString('fr-FR')} €`;
