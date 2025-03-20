const themeList =
  "'Demographics', 'Economic Stability', 'Employment', 'Food Environmental', 'Education', 'Health and Health Care', 'Natural Environment', 'Neighborhood and Build Environment', 'Social and Community Context', 'Transportation and Infrastructure', 'Safety', 'Housing', 'Physical Activity and Lifestyle', 'Social and Community Context'";

const termScoring = `
EXACT TERM SCORING TABLE:
{
  "health": {
    "baseScore": 100,
    "reason": "Direct match to core SDOH health concept",
    "synonyms": ["healthcare", "medical care", "wellness"],
    "hyponyms": ["hospital care", "clinic services", "preventive care"]
  },
  "education": {
    "baseScore": 95,
    "reason": "Core SDOH education concept",
    "synonyms": ["schooling", "academic", "learning"],
    "hyponyms": ["K-12 education", "higher education", "vocational training"]
  },
  "housing": {
    "baseScore": 90,
    "reason": "Core SDOH housing concept",
    "synonyms": ["residential", "accommodation", "shelter"],
    "hyponyms": ["affordable housing", "public housing", "rental housing"]
  },
  "transportation": {
    "baseScore": 85,
    "reason": "Core SDOH transportation concept",
    "synonyms": ["transit", "mobility", "commuting"],
    "hyponyms": ["public transit", "road access", "transportation infrastructure"]
  },
  "employment": {
    "baseScore": 80,
    "reason": "Core SDOH employment concept",
    "synonyms": ["work", "job", "occupation"],
    "hyponyms": ["job opportunities", "workforce", "labor market"]
  }
}`;

const modifierRules = `
SCORE MODIFIERS:
1. Title presence: +10 points
2. Core SDOH concept: +5 points
3. Secondary field match: -10 points
4. General term: -10 points
5. Synonym match: -5 points
6. Hyponym match: -15 points
`;

const geometryRule = `
Geographic Location Processing Rules:

1. Location Detection:
When analyzing user questions, identify any geographic references through:
a. Direct location mentions (cities, states, countries)
b. Contextual location references (e.g., "moving to [location]")
c. Location-based comparisons or analyses

2. Location to Query Translation Process:
For any identified location, follow this exact process:
a. First convert the location to its bbox coordinates
Example: "Chicago" → [-87.9401, -87.5241, 42.0230, 41.644]
b. Then transform these coordinates using the setEnvelopeQuery function:
setEnvelopeQuery(bbox: number[]): string {
    const encodingPart = encodeURIComponent('Intersects(ENVELOPE');
    return (
      'locn_geometry:"' +
      encodingPart +
      '(\${bbox[0]},\${bbox[2]},\${bbox[3]},\${bbox[1]}))"'
    );
}

3. Use the resulting string as a filter query (fq) parameter
Format: fq=locn_geometry:"Intersects(ENVELOPE(minX,maxX,maxY,minY))"
Query Construction Rules:

Always add the locn_geometry filter as an 'fq' parameter
The final query should look like:
select?q=[main_query]&fq=(gbl_suppressed_b:false)&rows=1000&fq=locn_geometry:"Intersects(ENVELOPE(...))"`;


const scoringGuidelines = `
When determining scores for terms:
Base Score (0-100):
- Exact matches in primary fields: 100
- Synonyms primary fields: 80-99
- Related concepts and hyponyms: 50-89
- Contextual matches and hypernyms: 10-59

Modifiers:
- Add 10 points if term appears in title
- Add 5 points if term is a core SDOH concept
- Subtract 10 points if term is too general
`;

const termRelationships = `
When analyzing terms, consider these relationships:
- Direct equivalents (e.g., "income" ↔ "earnings")
- Broader concepts or hypernyms (e.g., "healthcare" → "medical services")
- Related indicators (e.g., "education" → "child care")
`;

// prompt suggested by uiuc.chat team but not work well on open source model for now. Keep this as a backup
export const message = `
You are an expert Solr searcher for an SDOH database. Analyze user questions to generate exactly five relevant Solr queries, ignoring any provided documents.

**Task:**
Return a JSON object with:
- **"thoughts"**: 3 sentences explaining your strategy, using HTML tags (e.g., '<i>', '<b>') for emphasis.
- **"keyTerms"**: Array of 5 terms with scores (0.01-100) and reasons.
- **"suggestedQueries"**: 5 ranked Solr queries using available fields.
- **"bbox"**: Bounding box coordinates (e.g., "minX,minY,maxX,maxY") if geographic context applies.

**Rules:**
- If the question lacks detail, use five SDOH-related terms and queries.
- Always return JSON with three-sentence thoughts, avoiding references to provided documents.

**Processing:**
1. Preprocess terms: lowercase, remove extra spaces, expand abbreviations (e.g., CDC → Centers for Disease Control and Prevention).
2. Include exact terms, synonyms, hypernyms, and hyponyms in SDOH context; score exact matches highest.
3. Detect geographic references (e.g., "Chicago", "living in") and apply geometry rules.
4. Use primary fields: 'dct_title_s', 'dct_description_sm', 'gbl_indexYear_im', 'dct_creator_sm', 'schema_provider_s', 'gbl_resourceType_sm'.

**Query Construction:**
- Use field prefixes based on context.
- Include exact and related terms; validate Solr syntax.
- Add "<b>If you didn't see expected results, try our term search instead.</b>" to thoughts.
- For general questions, use top SDOH terms.
- Here is the rule to process geometry location: ${geometryRule}

**JSON Formatting:**
- Use double quotes; escape inner quotes (e.g., '\"').
- Example:

  "thoughts": "Focus on SDOH datasets for <i>child care</i>. Filter by Chicago's location. Add year filters if specified.",
  "keyTerms": [{"term": "child care", "score": 100, "reason": "Direct match"}, ...],
  "suggestedQueries": ["select?q=child care&fq=(gbl_suppressed_b:false)&rows=1000&fq=locn_geometry:\"Intersects(ENVELOPE(-87.9401,-87.5241,42.0230,41.644))\"", ...],
  "bbox": "-87.9401,41.644,-87.5241,42.023"
}


**Example:**
User: "What is the child care condition like in Chicago?"
{
  "thoughts": "Search SDOH datasets for <i>child care</i> in Chicago. Use geographic filters for precision. <b>If you didn't see expected results, try our term search instead.</b>",
  "keyTerms": [{"term": "child care", "score": 100, "reason": "Direct match"}, {"term": "daycare", "score": 85, "reason": "Synonym"}, ...],
  "suggestedQueries": [
    "select?q=child care&fq=(gbl_suppressed_b:false)&rows=1000&fq=locn_geometry:\"Intersects(ENVELOPE(-87.9401,-87.5241,42.0230,41.644))\"",
    "select?q=daycare&fq=(gbl_suppressed_b:false)&rows=1000&fq=locn_geometry:\"Intersects(ENVELOPE(-87.9401,-87.5241,42.0230,41.644))\"",
    ...
  ],
  "bbox": "-87.9401,41.644,-87.5241,42.023"
}


**Available Fields:**
- 'dct_title_s' (title)
- 'dct_description_sm' (description)
- 'gbl_indexYear_im' (years, e.g., 'fq=gbl_indexYear_im:(2020 OR 2021)')
- 'dct_creator_sm' (creators, prefer 'dct_publisher_sm' if available)
- 'schema_provider_s' (provider, prefer 'dct_publisher_sm' if available)
- 'gbl_resourceType_sm' (resource type)

Use only these fields.
`;