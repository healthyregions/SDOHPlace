export interface SearchState {
  schema: any;
  // object
  query: string;
  inputValue: string;
  options: any[];
  results: any[];
  relatedResults: any[];
  suggestions: any[];

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
  bboxSearch: boolean;
  bboxParam: [number, number, number, number] | null;

  // status
  isLoading: boolean;
  isSearching: boolean;
  isRecommending: boolean;
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
  bboxSearch: false,
  bboxParam: [-125.3321, 23.8991, -65.7421, 49.4325],
  subject: [],
  spatialResolution: [],
  visOverlays: [],
  visLyrs: [],
  indexYear: [],
  // status
  isLoading: false,
  isSearching: false,
  isRecommending: false,
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
