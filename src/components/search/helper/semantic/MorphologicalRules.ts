export const stemmingRules = [
  { suffix: 'ies', replacement: 'y' },
  { suffix: 'ied', replacement: 'y' },
  { suffix: 'ying', replacement: 'ie' },
  { suffix: 'ing', replacement: '' },
  { suffix: 'ly', replacement: '' },
  { suffix: 'ed', replacement: '' },
  { suffix: 'er', replacement: '' },
  { suffix: 'est', replacement: '' }
];

export const suffixRules = [
  { suffix: 'ing', base: '' },
  { suffix: 'ed', base: '' },
  { suffix: 'er', base: '' },
  { suffix: 'est', base: '' },
  { suffix: 'ly', base: '' }
]; 