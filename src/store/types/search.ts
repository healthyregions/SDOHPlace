export interface SearchState {
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
  bboxSearch: boolean;
  spatialResolution: string[];

  // status
  isLoading: boolean;
  isSearching: boolean;
  isRecommending: boolean;
  isSuggesting: boolean;
}

export const initialState: SearchState = {
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
  bboxSearch: false,
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
