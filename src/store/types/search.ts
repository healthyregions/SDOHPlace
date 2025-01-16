interface MapPreviewLyr {
  lyrId: string;
  filterIds: string[];
}

export interface SearchState {
  schema: any;
  // object
  query: string;
  inputValue: string;
  options: any[];
  results: any[];
  relatedResults: any[];
  suggestions: any[];
  spellCheck: string;
  originalQuery: string;
  usedQuery: string;
  usedSpellCheck: boolean;

  // sort
  sortBy: string;
  sortOrder: string;

  // filter
  filterQueries: any[];
  subject: string[];
  spatialResolution: string[];
  indexYear: string[];

  // map
  visOverlays: string[];
  visLyrs: string[];
  mapPreview: MapPreviewLyr[];
  bbox: [number, number, number, number] | null;

  // status
  isLoading: boolean;
  isSearching: boolean;
  isSuggesting: boolean;
}

export const initialState: SearchState = {
  schema: null,
  query: "",
  inputValue: "",
  options: [],
  filterQueries: [],
  results: [],
  relatedResults: [],
  suggestions: [],
  sortBy: "score",
  sortOrder: "desc",
  bbox: null,
  subject: [],
  spatialResolution: [],
  visOverlays: [],
  visLyrs: [],
  mapPreview: [],
  indexYear: [],
  spellCheck: "",
  originalQuery: "",
  usedQuery: "",
  usedSpellCheck: false,
  // status
  isLoading: false,
  isSearching: false,
  isSuggesting: false,
};

export interface SolrSuggestion {
  term: string;
  weight: number;
  payload: string;
}

export interface SolrSuggestResponse {
  suggest: {
    sdohSuggester: {
      [key: string]: {
        numFound: number;
        suggestions: SolrSuggestion[];
      };
    };
  };
}
