import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import SolrQueryBuilder from "../../components/search/helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import {
  BatchResetFiltersPayload,
  initialState,
  SolrSuggestResponse,
} from "@/store/types/search";
import { generateFilterQueries } from "@/middleware/filterHelper";
import { setShowClearButton } from "./uiSlice";
import { RootState } from "..";

const inProgressSuggestions = new Set<string>();
export const initializeSearch = createAsyncThunk(
  "search/initialize",
  async ({ schema }: { schema: any }, { dispatch, getState }) => {
    dispatch(setInitializing(true));
    dispatch(setSchema(schema));
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const state = getState() as RootState;
      const filterQueries = generateFilterQueries(state.search);
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
      const baseUrl =
        process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";
      const response = await fetch(
        `${baseUrl}/.netlify/edge-functions/chat-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get search strategy");
      }
      const analysis = await response.json();
      dispatch(setThoughts(analysis.thoughts));
      const searchQueryBuilder = new SolrQueryBuilder();
      searchQueryBuilder.setSchema(schema);
      const results = await Promise.all(
        analysis.suggestedQueries.map(async (q: string) => {
          try {
            const result = await searchQueryBuilder
              .directlyQuery(q)
              .fetchResult();
            return result.results || [];
          } catch (error) {
            console.error(`Error fetching results for query "${q}":`, error);
            return [];
          }
        })
      );
      results.sort((a, b) => {
        const scoreA = analysis.suggestedQueries.findIndex(
          (q: string) => q === a.query
        );
        const scoreB = analysis.suggestedQueries.findIndex(
          (q: string) => q === b.query
        );
        return scoreA - scoreB;
      });
      const combinedResults = results.flat();
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item.id, item])).values()
      );
      return {
        searchResults: uniqueResults,
        relatedResults: [],
        suggestions: [],
        originalQuery: question,
        usedQuery: analysis.suggestedQueries.join(", "),
        usedSpellCheck: false,
        analysis,
      };
    } catch (error) {
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
    
    if (isForceRefresh) {
      console.log(`Force refreshing search for: "${cleanQuery}"`);
    }
    
    const state = getState() as RootState;
    const currentRequestId = state.search.currentRequestId;
    if (currentRequestId !== requestId && !bypassSpellCheck) {
      return;
    }
    const isAISearch = state.search.aiSearch;
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
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
    let suggestions = [];
    if (cleanQuery && cleanQuery !== "*") {
      const suggestResult = await searchQueryBuilder
        .suggestQuery(cleanQuery)
        .fetchResult();
      const suggestResponse = suggestResult as unknown as SolrSuggestResponse;
      suggestions =
        suggestResponse.suggest?.sdohSuggester[cleanQuery]?.suggestions || [];
    }
    
    const validSuggestions = suggestions
      .filter((s) => s.payload === "false")
      .filter((s) => s.weight >= 50)
      .map((s) => s.term)
      .sort((a, b) => {
        const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
        const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
        return weightB - weightA;
      });
    searchQueryBuilder.combineQueries(cleanQuery, filterQueries, sortBy, sortOrder);
    const skipCache = isForceRefresh;
    const { results: searchResults, spellCheckSuggestion } =
      await searchQueryBuilder.fetchResult(undefined, skipCache);
    if (spellCheckSuggestion) {
      dispatch(setSpellCheck(spellCheckSuggestion));
    }
    
    let finalResults = searchResults;
    let usedQuery = cleanQuery;
    let usedSpellCheck = false;
    
    if (
      !bypassSpellCheck &&
      (!searchResults || searchResults.length === 0) &&
      spellCheckSuggestion &&
      spellCheckSuggestion !== cleanQuery
    ) {
      searchQueryBuilder.combineQueries(
        spellCheckSuggestion,
        filterQueries,
        sortBy,
        sortOrder
      );
      const { results: spellCheckResults } =
        await searchQueryBuilder.fetchResult(undefined, skipCache);
      if (spellCheckResults && spellCheckResults.length > 0) {
        finalResults = spellCheckResults;
        usedQuery = spellCheckSuggestion;
        usedSpellCheck = true;
      }
    }
    finalResults = finalResults.map((result) => ({
      ...result,
      years: Array.isArray(result.years)
        ? result.years
        : Array.from(result.years || []),
    }));
    const primaryResponse = {
      searchResults: finalResults,
      relatedResults: [],
      suggestions: validSuggestions,
      originalQuery: cleanQuery,
      usedQuery,
      usedSpellCheck,
    };
    dispatch({ 
      type: "search/fetchSearchAndRelated/fulfilled", 
      payload: primaryResponse,
      meta: { requestId }
    });
    if (isForceRefresh) {
      inProgressSuggestions.clear();
    }
    const relatedResults = [];
    if (validSuggestions.length > 0) {
      Array.from(inProgressSuggestions).forEach(suggestion => {
        if (!validSuggestions.includes(suggestion)) {
          inProgressSuggestions.delete(suggestion);
        }
      });
      const uniqueSuggestions = validSuggestions.filter(s => s !== usedQuery);
      for (const suggestion of uniqueSuggestions) {
        if (inProgressSuggestions.has(suggestion)) {
          console.log(`Skipping duplicate fetch for term: "${suggestion}"`);
          continue;
        }
        try {
          inProgressSuggestions.add(suggestion);
          const { results: suggestionResults } = await searchQueryBuilder
            .generalQuery(suggestion)
            .fetchResult(undefined, false);
          inProgressSuggestions.delete(suggestion);
          relatedResults.push(...suggestionResults);
          if (relatedResults.length > 0) {
            dispatch({
              type: "search/updateRelatedResults",
              payload: relatedResults
            });
          }
        } catch (error) {
          inProgressSuggestions.delete(suggestion);
          console.error(`Error fetching related results for "${suggestion}":`, error);
        }
      }
    }
    return {
      searchResults: finalResults,
      relatedResults: relatedResults,
      suggestions: validSuggestions,
      originalQuery: cleanQuery,
      usedQuery,
      usedSpellCheck,
    };
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
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    searchQueryBuilder.combineQueries(query, filterQueries, sortBy, sortOrder);
    const { results, spellCheckSuggestion } =
      await searchQueryBuilder.fetchResult();
    if (spellCheckSuggestion) {
      dispatch(setSpellCheck(spellCheckSuggestion));
    }
    if (
      !bypassSpellCheck &&
      (!results ||
        (results.length === 0 &&
          spellCheckSuggestion &&
          spellCheckSuggestion !== query))
    ) {
      const state = getState() as any;
      const spellCheckSuggestion = state.search.spellCheck;
      if (spellCheckSuggestion && spellCheckSuggestion !== query) {
        searchQueryBuilder.combineQueries(
          spellCheckSuggestion,
          filterQueries,
          sortBy,
          sortOrder
        );
        const { results: spellCheckResults } =
          await searchQueryBuilder.fetchResult();
        if (spellCheckResults && spellCheckResults.length > 0) {
          return {
            results: spellCheckResults.map((result) => ({
              ...result,
              years: Array.isArray(result.years)
                ? result.years
                : Array.from(result.years || []),
            })),
            originalQuery: query,
            usedQuery: spellCheckSuggestion,
            usedSpellCheck: true,
          };
        }
      }
    }
    return {
      results: results.map((result) => ({
        ...result,
        years: Array.isArray(result.years)
          ? result.years
          : Array.from(result.years || []),
      })),
      originalQuery: query,
      usedQuery: query,
      usedSpellCheck: false,
    };
  }
);

export const fetchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async ({ inputValue, schema }: { inputValue: string; schema: any }) => {
    const queryBuilder = new SolrQueryBuilder();
    queryBuilder.setSchema(schema);
    const result = await queryBuilder.suggestQuery(inputValue).fetchResult();
    const suggestResponse = result as unknown as SolrSuggestResponse;
    const suggestions =
      suggestResponse.suggest?.sdohSuggester[inputValue]?.suggestions || [];
    return suggestions
      .filter((s) => s.weight >= 50 && s.payload === "false")
      .map((s) => s.term)
      .sort((a, b) => {
        const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
        const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
        return weightB - weightA;
      });
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
          filterQueries: generateFilterQueries(state.search),
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
      if (!state.search.thoughts) {
        dispatch(setIsSearching(true));
      }
      const baseUrl =
        process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";
      const response = await fetch(
        `${baseUrl}/.netlify/edge-functions/chat-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: query }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to reload AI search: ${response.status}`);
      }
      
      const analysis = await response.json();
      dispatch(setThoughts(analysis.thoughts || ""));
      if (!analysis.suggestedQueries || analysis.suggestedQueries.length === 0) {
        return {
          searchResults: [],
          relatedResults: [],
          suggestions: [],
          originalQuery: query,
          usedQuery: "",
          usedSpellCheck: false,
        };
      }
      const searchQueryBuilder = new SolrQueryBuilder();
      searchQueryBuilder.setSchema(schema);
      const results = await Promise.all(
        analysis.suggestedQueries.map(async (q: string) => {
          try {
            const result = await searchQueryBuilder
              .directlyQuery(q)
              .fetchResult();
            return result.results || [];
          } catch (error) {
            console.error(`Error fetching results for query "${q}":`, error);
            return [];
          }
        })
      );
      const combinedResults = results.flat();
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item.id, item])).values()
      );
      
      return {
        searchResults: uniqueResults,
        relatedResults: [],
        suggestions: [],
        originalQuery: query,
        usedQuery: analysis.suggestedQueries.join(", "),
        usedSpellCheck: false,
      };
    } catch (error) {
      console.error("Failed to reload AI search:", error);
      dispatch(setIsSearching(false));
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
      state.relatedResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchAndRelatedResults.pending, (state, action) => {
        state.isSearching = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchSearchAndRelatedResults.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          if (action.payload) {
            state.results = generateSolrObjectList(action.payload.searchResults || []);
            state.relatedResults = generateSolrObjectList(action.payload.relatedResults || []);
            state.suggestions = action.payload.suggestions || [];
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
        if (!state.thoughts || state.results.length === 0) {
          state.isSearching = true;
        }
      })
      .addCase(reloadAiSearchFromUrl.fulfilled, (state, action) => {
        if (action.payload) {
          state.results = generateSolrObjectList(action.payload.searchResults || []);
          state.relatedResults = generateSolrObjectList(action.payload.relatedResults || []);
          state.suggestions = action.payload.suggestions || [];
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
} = searchSlice.actions;

export default searchSlice.reducer;
