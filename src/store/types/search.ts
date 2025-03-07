export interface SearchState {
  schema: any;
  // object
  aiSearch: boolean;
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
  thoughts: string;

  // sort
  sort: {
    sortBy: string;
    sortOrder: string;
  };
  
  // filter
  filterQueries: any[];
  subject: string[];
  spatialResolution: string[];
  indexYear: string[];

  // map
  visOverlays: string[];
  bbox: [number, number, number, number] | null;

  // status
  currentRequestId: string;
  initializing: boolean;
  isLoading: boolean;
  isSearching: boolean;
  isSuggesting: boolean;
}

export const initialState: SearchState = {
  aiSearch: false,
  thoughts: "",
  schema: null,
  query: "",
  inputValue: "",
  options: [],
  filterQueries: [],
  results: [],
  relatedResults: [],
  suggestions: [],
  // sort
  sort: {
    sortBy: "score",
    sortOrder: "desc",
  },
  bbox: null,
  subject: [],
  spatialResolution: [],
  visOverlays: [],
  indexYear: [],
  spellCheck: "",
  originalQuery: "",
  usedQuery: "",
  usedSpellCheck: false,
  // status
  currentRequestId: null,
  initializing: false,
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

export interface BatchResetFiltersPayload {
  schema: any;
  query: string;
}