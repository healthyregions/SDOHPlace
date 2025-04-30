import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import SolrQueryBuilder from "../../components/search/helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import {
  BatchResetFiltersPayload,
  initialState,
} from "@/store/types/search";
import { setShowClearButton } from "./uiSlice";
import { RootState } from "..";
import { SearchService } from "@/services/SearchService";
import { deduplicateResults } from "@/components/search/helper/SearchUtils";
import suggestionManager from "@/components/search/helper/SuggestionManager";
import filterService from "@/middleware/FilterService";

export const initializeSearch = createAsyncThunk(
  "search/initialize",
  async ({ schema }: { schema: any }, { dispatch, getState }) => {
    dispatch(setInitializing(true));
    dispatch(setSchema(schema));
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const state = getState() as RootState;
      const filterQueries = filterService.generateFilterQueries(state.search);
      const hasRealQuery = state.search.query && state.search.query !== "*";
      const hasActiveFilters = filterQueries.length > 0;
      if (hasRealQuery || hasActiveFilters) {
        if (state.search.aiSearch && hasRealQuery) {
          await dispatch(
            performChatGptSearch({
              question: state.search.query,
              filterQueries,
              schema,
            })
          ).unwrap();
        } else {
          await dispatch(
            fetchSearchAndRelatedResults({
              query: state.search.query || "*",
              filterQueries,
              schema,
              bypassSpellCheck: false,
            })
          ).unwrap();
        }
      } else {
        await dispatch(
          fetchSearchAndRelatedResults({
            query: "*",
            filterQueries: [],
            schema,
            bypassSpellCheck: false,
          })
        ).unwrap();
      }
      return { success: true };
    } finally {
      dispatch(setInitializing(false));
    }
  }
);

export const performChatGptSearch = createAsyncThunk(
  "search/performChatGptSearch",
  async (
    {
      question,
      filterQueries,
      schema,
    }: {
      question: string;
      filterQueries: Array<any>;
      schema: any;
    },
    { dispatch }
  ) => {
    try {
      dispatch(setRelatedResultsLoading(true));
      
      const searchService = new SearchService(schema);
      const result = await searchService.performChatGptSearch(question, filterQueries);
      
      if (result.analysis?.thoughts) {
        dispatch(setThoughts(result.analysis.thoughts));
      }
      
      dispatch(setRelatedResultsLoading(false));
      return result;
    } catch (error) {
      dispatch(setRelatedResultsLoading(false));
      throw new Error(`ChatGPT search failed: ${error.message}`);
    }
  }
);

export const fetchSearchAndRelatedResults = createAsyncThunk(
  "search/fetchSearchAndRelated",
  async (
    {
      query,
      filterQueries,
      schema,
      sortBy,
      sortOrder,
      bypassSpellCheck = false,
    }: {
      query: string;
      filterQueries: Array<any>;
      schema: any;
      sortBy?: string;
      sortOrder?: string;
      bypassSpellCheck: boolean;
    },
    { dispatch, getState, requestId }
  ) => {
    const isForceRefresh = query.includes(":");
    const cleanQuery = isForceRefresh ? query.split(":")[0] : query;
    const state = getState() as RootState;
    const currentRequestId = state.search.currentRequestId;
    if (currentRequestId !== requestId && !bypassSpellCheck) return;
    
    dispatch(setRelatedResultsLoading(true));
    
    try {
      const isAISearch = state.search.aiSearch;
      
      if (isAISearch && !Array.isArray(cleanQuery) && cleanQuery !== "*") {
        const aiResponse = await dispatch(
          performChatGptSearch({
            question: cleanQuery,
            filterQueries,
            schema,
          })
        ).unwrap();
        return aiResponse;
      }
      
      const searchService = new SearchService(schema);
      const searchResult = await searchService.fetchSearchWithRelated(
        cleanQuery, 
        filterQueries, 
        sortBy, 
        sortOrder, 
        isForceRefresh
      );
      
      if (searchResult.usedSpellCheck && searchResult.usedQuery) {
        dispatch(setSpellCheck(searchResult.usedQuery));
      }
      
      const primaryResponse = {
        searchResults: searchResult.searchResults,
        relatedResults: [],
        suggestions: searchResult.suggestions,
        originalQuery: cleanQuery,
        usedQuery: searchResult.usedQuery,
        usedSpellCheck: searchResult.usedSpellCheck,
      };
      
      dispatch({ 
        type: "search/fetchSearchAndRelated/fulfilled", 
        payload: primaryResponse,
        meta: { requestId }
      });
      
      if (isForceRefresh) {
        suggestionManager.clearAll();
      }
      
      const relatedResults = [];
      if (searchResult.suggestions.length > 0) {
        suggestionManager.cleanupSuggestions(searchResult.suggestions);
        
        const uniqueSuggestions = searchResult.suggestions.filter(s => s !== searchResult.usedQuery);
        const allRelatedResults = [];
        
        for (const suggestion of uniqueSuggestions) {
          if (suggestionManager.hasSuggestion(suggestion)) continue;
          
          try {
            suggestionManager.addSuggestion(suggestion);
            const queryBuilder = new SolrQueryBuilder();
            queryBuilder.setSchema(schema);
            const { results: suggestionResults } = await queryBuilder
              .generalQuery(suggestion)
              .fetchResult(undefined, false);
            suggestionManager.removeSuggestion(suggestion);
            
            if (suggestionResults && suggestionResults.length > 0) {
              allRelatedResults.push(...suggestionResults);
            }
          } catch (error) {
            suggestionManager.removeSuggestion(suggestion);
            console.error(`Error fetching related results for "${suggestion}":`, error);
          }
        }
        
        if (allRelatedResults.length > 0) {
          const uniqueResults = deduplicateResults(allRelatedResults);
          dispatch({
            type: "search/updateRelatedResults",
            payload: uniqueResults
          });
          uniqueResults.forEach(result => relatedResults.push(result));
        } 
      }
      
      dispatch(setRelatedResultsLoading(false));
      
      return {
        searchResults: searchResult.searchResults,
        relatedResults: relatedResults,
        suggestions: searchResult.suggestions,
        originalQuery: cleanQuery,
        usedQuery: searchResult.usedQuery,
        usedSpellCheck: searchResult.usedSpellCheck,
      };
    } catch (error) {
      console.error("Error in fetchSearchAndRelatedResults:", error);
      dispatch(setRelatedResultsLoading(false));
      throw error;
    }
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (
    {
      query,
      filterQueries,
      schema,
      sortBy,
      sortOrder,
      bypassSpellCheck = false,
    }: {
      query: string;
      filterQueries: Array<any>;
      schema: any;
      sortBy?: string;
      sortOrder?: string;
      bypassSpellCheck?: boolean;
    },
    { dispatch, getState }
  ) => {
    const searchService = new SearchService(schema);
    const result = await searchService.fetchSearchWithRelated(query, filterQueries, sortBy, sortOrder);
    
    if (result.usedSpellCheck && result.usedQuery) {
      dispatch(setSpellCheck(result.usedQuery));
    }
    
    return {
      results: result.searchResults,
      originalQuery: result.originalQuery,
      usedQuery: result.usedQuery,
      usedSpellCheck: result.usedSpellCheck,
    };
  }
);

export const fetchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async ({ inputValue, schema }: { inputValue: string; schema: any }) => {
    const searchService = new SearchService(schema);
    return searchService.getSearchSuggestions(inputValue);
  }
);

export const atomicResetAndFetch = createAsyncThunk(
  "search/atomicResetAndFetch",
  async (schema: any, { dispatch }) => {
    return { schema };
  }
);

export const clearSearch = createAsyncThunk(
  "search/clearSearch",
  async (_, { dispatch, getState }) => {
    const state = getState() as { search: typeof initialState };
    dispatch(setInputValue(""));
    dispatch(setShowClearButton(false));
    dispatch(setThoughts(""));
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (state.search.schema) {
      dispatch(
        fetchSearchResults({
          query: "*",
          filterQueries: filterService.generateFilterQueries(state.search),
          schema: state.search.schema,
          sortBy: state.search.sort.sortBy,
          sortOrder: state.search.sort.sortOrder,
          bypassSpellCheck: true,
        })
      );
    }
  }
);

export const batchResetFilters = createAction<BatchResetFiltersPayload>(
  "search/batchResetFilters"
);

export const reloadAiSearchFromUrl = createAsyncThunk(
  "search/reloadAiSearchFromUrl",
  async (
    {
      query,
      schema,
    }: {
      query: string;
      schema: any;
    },
    { dispatch, getState }
  ) => {
    try {
      const state = getState() as RootState;
      if (!query || query === "*" || !state.search.aiSearch) {
        return;
      }
      
      dispatch(setAISearch(true));
      dispatch(setQuery(query));
      
      if (!state.search.results.length && !state.search.thoughts) {
        dispatch(setIsSearching(true));
        dispatch(setRelatedResultsLoading(true));
      }
      
      const searchService = new SearchService(schema);
      const result = await searchService.performChatGptSearch(query, []);
      
      if (result.analysis?.thoughts) {
        dispatch(setThoughts(result.analysis.thoughts || ""));
      }
      
      dispatch(setRelatedResultsLoading(false));
      
      return {
        searchResults: result.searchResults,
        relatedResults: result.relatedResults,
        suggestions: result.suggestions,
        originalQuery: query,
        usedQuery: result.usedQuery,
        usedSpellCheck: false,
      };
    } catch (error) {
      console.error("Failed to reload AI search:", error);
      dispatch(setIsSearching(false));
      dispatch(setRelatedResultsLoading(false));
      return null;
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSchema: (state, action) => {
      state.schema = action.payload;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setFilterQueries: (state, action) => {
      state.filterQueries = action.payload;
    },
    setSort: (state, action) => {
      const { field, direction } = action.payload;
      state.sort.sortBy = field;
      state.sort.sortOrder = direction;
    },
    setBbox: (state, action) => {
      state.bbox = action.payload;
    },
    setVisOverlays: (state, action) => {
      state.visOverlays = action.payload;
    },
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
    setSpatialResolution: (state, action) => {
      state.spatialResolution = action.payload;
    },
    setIndexYear: (state, action) => {
      state.indexYear = action.payload;
    },
    setThoughts: (state, action) => {
      state.thoughts = action.payload;
    },
    setSpellCheck: (state, action) => {
      state.spellCheck = action.payload;
    },
    setOriginalQuery: (state, action) => {
      state.originalQuery = action.payload;
    },
    setUsedQuery: (state, action) => {
      state.usedQuery = action.payload;
    },
    setUsedSpellCheck: (state, action) => {
      state.usedSpellCheck = action.payload;
    },
    setAISearch: (state, action) => {
      state.aiSearch = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
      state.originalQuery = action.payload;
      state.usedQuery = action.payload;
      state.usedSpellCheck = false;
      state.spellCheck = null;
      state.suggestions = [];
    },
    resetQuerySearch: (state) => {
      return {
        ...initialState,
        schema: state.schema,
      };
    },
    clearSearchState: (state) => {
      state.inputValue = "";
      state.query = "*";
      state.originalQuery = undefined;
      state.usedQuery = undefined;
      state.usedSpellCheck = false;
      state.spellCheck = null;
      state.suggestions = [];
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setInitializing: (state, action) => {
      state.initializing = action.payload;
    },
    updateRelatedResults: (state, action) => {
      state.relatedResults = Array.isArray(action.payload) ? [...action.payload] : [];
    },
    setRelatedResultsLoading: (state, action) => {
      state.relatedResultsLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchAndRelatedResults.pending, (state, action) => {
        state.isSearching = true;
        state.relatedResultsLoading = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchSearchAndRelatedResults.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          if (action.payload) {
            state.results = generateSolrObjectList(action.payload.searchResults || []);
            state.relatedResults = generateSolrObjectList(action.payload.relatedResults || []);
            state.suggestions = Array.isArray(action.payload.suggestions) ? [...action.payload.suggestions] : [];
            state.originalQuery = action.payload.originalQuery;
            state.usedQuery = action.payload.usedQuery;
            state.usedSpellCheck = action.payload.usedSpellCheck || false;
          }
          state.isSearching = false;
        }
      })
      .addCase(fetchSearchAndRelatedResults.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.isSearching = false;
          state.relatedResultsLoading = false;
          state.results = [];
          state.relatedResults = [];
        }
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        if (action.payload) {
          state.results = generateSolrObjectList(action.payload.results || []);
          state.originalQuery = action.payload.originalQuery;
          state.usedQuery = action.payload.usedQuery;
          state.usedSpellCheck = action.payload.usedSpellCheck || false;
        }
        state.isSearching = false;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
      })
      .addCase(fetchSuggestions.pending, (state) => {})
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(atomicResetAndFetch.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(atomicResetAndFetch.fulfilled, (state, action) => {
        state.spatialResolution = null;
        state.subject = null;
        state.sort.sortBy = "score";
        state.sort.sortOrder = "desc";
        state.filterQueries = [];
        state.schema = action.payload.schema;
      })
      .addCase(clearSearch.pending, (state) => {
        state.inputValue = "";
        state.suggestions = [];
      })
      .addCase(clearSearch.fulfilled, (state) => {
        state.inputValue = "";
        state.query = "*";
        state.originalQuery = "*";
        state.usedQuery = "*";
        state.usedSpellCheck = false;
        state.spellCheck = null;
        state.suggestions = [];
      })
      .addCase(batchResetFilters, (state, action) => {
        state.bbox = null;
        state.spatialResolution = [];
        state.indexYear = [];
        state.filterQueries = [];
        state.schema = action.payload.schema;
        state.query = action.payload.query;
        state.sort.sortBy = "score";
        state.sort.sortOrder = "desc";
        if (action.payload.preserveSubject && action.payload.subject) {
          state.subject = action.payload.subject;
        } else {
          state.subject = [];
        }
      })
      .addCase(reloadAiSearchFromUrl.pending, (state) => {
        if (!state.results.length && !state.thoughts) {
          state.isSearching = true;
        }
      })
      .addCase(reloadAiSearchFromUrl.fulfilled, (state, action) => {
        if (action.payload) {
          state.results = generateSolrObjectList(action.payload.searchResults || []);
          state.relatedResults = generateSolrObjectList(action.payload.relatedResults || []);
          state.suggestions = Array.isArray(action.payload.suggestions) ? [...action.payload.suggestions] : [];
          state.originalQuery = action.payload.originalQuery;
          state.usedQuery = action.payload.usedQuery;
          state.usedSpellCheck = action.payload.usedSpellCheck || false;
        }
        state.isSearching = false;
      })
      .addCase(reloadAiSearchFromUrl.rejected, (state) => {
        state.isSearching = false;
      });
  },
});

export const {
  setSchema,
  setQuery,
  setInputValue,
  setThoughts,
  setFilterQueries,
  setSort,
  setBbox,
  setVisOverlays,
  setSubject,
  setSpatialResolution,
  setIndexYear,
  setSpellCheck,
  setOriginalQuery,
  setUsedQuery,
  setUsedSpellCheck,
  setAISearch,
  resetQuerySearch,
  setIsSearching,
  setInitializing,
  updateRelatedResults,
  setRelatedResultsLoading,
} = searchSlice.actions;

export default searchSlice.reducer;
