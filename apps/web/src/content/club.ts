export const club = {
  name: 'Ranheim E-sport',
  parent: 'Ranheim Idrettslag',
  founded: 'Høsten 2024',
  membersApprox: 70,
  city: 'Trondheim',
  slogan: 'Flest mulig, lengst mulig',
  orgNumber: '975 605 140',
  email: 'post@ril.no',
  address: {
    venue: 'Krafthallen',
    street: 'Ranheimsfjæra 44',
    postalCode: '7055',
    city: 'RANHEIM',
  },
  summary:
    'Ranheim E-sport skal gi barn og unge en trygg, sosial og aktiv arena for å dyrke sin gaminginteresse, med mål om å holde barna i idretten så lenge som mulig. Ranheim E-sport er en del av Ranheim idrettslag og har ca 70 medlemmer fra Ranheim og flere andre bydeler i Trondheim.',
  games: ['Counter-Strike 2'],
} as const;

export const publicNav = [
  { href: '/', label: 'Hjem' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/lag', label: 'Lag' },
  { href: '/spillere', label: 'Spillere' },
  { href: '/trenere', label: 'Trenere' },
  { href: '/kamper', label: 'Kamper' },
  { href: '/nyheter', label: 'Nyheter' },
  { href: '/streaming', label: 'Streaming' },
  { href: '/sponsorer', label: 'Sponsorer' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

export const secondaryNav = [
  { href: '/resultater', label: 'Resultater' },
  { href: '/turneringer', label: 'Turneringer' },
  { href: '/media', label: 'Media' },
] as const;
