/** The nine page swatches of the specimen color picker (fixture data shared by swatch-strip and color-picker). */
export const specimenSwatches: { id: string; color: string; label: string; token?: boolean }[] = [
  { id: 'orange', color: '#e2763f', label: 'Orange' },
  { id: 'brown', color: '#2b1d14', label: 'Brown' },
  { id: 'accent', color: 'var(--cs-accent-600)', label: 'accent token', token: true },
  { id: 'mint', color: 'var(--cs-mint-500)', label: 'mint token', token: true },
  { id: 'paper', color: '#f4ede4', label: 'Paper' },
  { id: 'iris', color: '#5f4994', label: 'Iris' },
  { id: 'sun', color: '#ffcf5a', label: 'Sun' },
  { id: 'ink', color: '#111317', label: 'Ink' },
  { id: 'coral', color: 'var(--cs-coral-500)', label: 'coral token', token: true },
];
