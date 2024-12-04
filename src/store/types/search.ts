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
  bboxParam: any;
  subject: string[];
  spatialResolution: string[];

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
  bboxParam: null,
  subject: [],
  spatialResolution: [],
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
