interface SemanticEntry {
  synonyms: string[];
  hypernyms: string[];
  hyponyms: string[];
  related: string[];
  domain_terms: string[];
}

export const sdohSemanticDatabase = new Map<string, SemanticEntry>([
  ['health', {
    synonyms: ['healthcare', 'wellness', 'wellbeing', 'medical', 'clinical'],
    hypernyms: ['care', 'treatment', 'services'],
    hyponyms: ['disease', 'illness', 'condition', 'disorder', 'syndrome'],
    related: ['hospital', 'clinic', 'doctor', 'nurse', 'medicine', 'therapy', 'prevention', 'diagnosis'],
    domain_terms: ['mortality', 'morbidity', 'epidemiology']
  }],
  ['housing', {
    synonyms: ['home', 'residence', 'dwelling', 'shelter'],
    hypernyms: ['accommodation', 'living', 'residential'],
    hyponyms: ['house', 'apartment', 'condo', 'rental'],
    related: ['neighborhood', 'community', 'homeless', 'affordable', 'rent', 'mortgage'],
    domain_terms: ['stability', 'security', 'quality', 'overcrowding']
  }],
  ['education', {
    synonyms: ['schooling', 'learning', 'academic', 'educational'],
    hypernyms: ['knowledge', 'instruction', 'training'],
    hyponyms: ['elementary', 'secondary', 'college', 'university', 'vocational'],
    related: ['student', 'teacher', 'graduation', 'literacy', 'curriculum'],
    domain_terms: ['attainment', 'readiness', 'achievement']
  }],
  ['employment', {
    synonyms: ['work', 'job', 'occupation', 'career'],
    hypernyms: ['labor', 'workforce', 'economic'],
    hyponyms: ['unemployment', 'underemployment'],
    related: ['income', 'salary', 'wage', 'benefits', 'workplace'],
    domain_terms: ['security', 'mobility', 'participation']
  }],
  ['poverty', {
    synonyms: ['poor', 'disadvantaged', 'underprivileged'],
    hypernyms: ['economic', 'financial', 'socioeconomic'],
    hyponyms: [],
    related: ['income', 'wealth', 'inequality', 'deprivation'],
    domain_terms: ['hardship', 'stress']
  }],
  ['birth', {
    synonyms: ['born', 'childbirth', 'delivery', 'natal'],
    hypernyms: ['reproduction', 'maternal', 'perinatal'],
    hyponyms: [],
    related: ['pregnancy', 'infant', 'newborn', 'mother', 'prenatal'],
    domain_terms: ['outcomes']
  }],
  ['child', {
    synonyms: ['children', 'kid', 'youth', 'minor', 'pediatric'],
    hypernyms: ['population', 'demographic'],
    hyponyms: ['infant', 'toddler', 'preschooler', 'adolescent'],
    related: ['family', 'parent', 'childhood', 'development'],
    domain_terms: ['welfare']
  }]
]); 