import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SolrQueryBuilder from "../../components/search/helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import { initialState, SolrSuggestResponse } from "@/store/types/search";
import { generateFilterQueries } from "@/middleware/filterHelper";
import { setShowClearButton } from "./uiSlice";

export const performChatGptSearch = createAsyncThunk(
  "search/performChatGptSearch",
  async (
    {
      question,
      schema
    }: {
      question: string;
      schema: any;
    },
    { dispatch }
  ) => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8888"
          : ""; 
      const response = await fetch(`${baseUrl}/.netlify/edge-functions/chat-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });   
      if (!response.ok) {
        throw new Error("Failed to get search strategy");
      }

      const analysis  = await response.json();
      console.log("Chatgpt Analysis:", analysis);
      dispatch(setThoughts(analysis.thoughts));
      const results = await dispatch(
        fetchSearchAndRelatedResults({
          query: analysis.suggestedQueries,
          filterQueries: null,
          schema: schema,
          bypassSpellCheck: true,
        })
      ).unwrap();
      return {
        results,
        analysis
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
      query: string | Array<string>;
      filterQueries: Array<any>;
      schema: any;
      sortBy?: string;
      sortOrder?: string;
      bypassSpellCheck: boolean;
    },
    { dispatch }
  ) => {
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    // Search directly for the query if it is an array of queries (i.e. coming from LLM suggestion)
    if (Array.isArray(query)) {
      const results = await Promise.all(
        query.map(async (q) => {
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
        usedQuery: query,
        usedSpellCheck: false,
      };
    }
    const suggestResult = await searchQueryBuilder
      .suggestQuery(query)
      .fetchResult();
    const suggestResponse = suggestResult as unknown as SolrSuggestResponse;
    let suggestions =
      suggestResponse.suggest?.sdohSuggester[query]?.suggestions || [];
    const validSuggestions = suggestions
      .filter((s) => s.payload === "false")
      .map((s) => s.term)
      .sort((a, b) => {
        const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
        const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
        return weightB - weightA;
      })
      .slice(0, 10);
    searchQueryBuilder.combineQueries(query, filterQueries, sortBy, sortOrder);
    const { results: searchResults, spellCheckSuggestion } =
      await searchQueryBuilder.fetchResult();
    if (spellCheckSuggestion) {
      dispatch(setSpellCheck(spellCheckSuggestion));
    }
    let finalResults = searchResults;
    let usedQuery = query;
    let usedSpellCheck = false;

    if (
      !bypassSpellCheck &&
      (!searchResults || searchResults.length === 0) &&
      spellCheckSuggestion &&
      spellCheckSuggestion !== query
    ) {
      searchQueryBuilder.combineQueries(
        spellCheckSuggestion,
        filterQueries,
        sortBy,
        sortOrder
      );
      const { results: spellCheckResults } =
        await searchQueryBuilder.fetchResult();
      if (spellCheckResults && spellCheckResults.length > 0) {
        finalResults = spellCheckResults;
        usedQuery = spellCheckSuggestion;
        usedSpellCheck = true;
      }
    }

    const relatedResults = [];
    for (const suggestion of validSuggestions) {
      if (suggestion !== usedQuery) {
        const { results: suggestionResults } = await searchQueryBuilder
          .generalQuery(suggestion)
          .fetchResult();
        relatedResults.push(...suggestionResults);
      }
    }
    return {
      searchResults: finalResults.map((result) => ({
        ...result,
        years: Array.isArray(result.years)
          ? result.years
          : Array.from(result.years || []),
      })),
      relatedResults,
      suggestions: validSuggestions,
      originalQuery: query,
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
      })
      .slice(0, 20);
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
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (state.search.schema) {
      dispatch(
        fetchSearchAndRelatedResults({
          query: "*",
          filterQueries: generateFilterQueries(state.search),
          schema: state.search.schema,
          sortBy: state.search.sortBy,
          sortOrder: state.search.sortOrder,
          bypassSpellCheck: true,
        })
      );
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
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setBbox: (state, action) => {
      state.bbox = action.payload;
    },
    setVisOverlays: (state, action) => {
      state.visOverlays = action.payload;
    },
    setVisLyrs: (state, action) => {
      state.visLyrs = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchAndRelatedResults.pending, (state) => {
        state.isSearching = true;
        state.results = [];
        state.relatedResults = [];
      })
      .addCase(fetchSearchAndRelatedResults.fulfilled, (state, action) => {
        state.results = generateSolrObjectList(action.payload.searchResults);
        state.relatedResults = generateSolrObjectList(
          action.payload.relatedResults
        );
        state.suggestions = action.payload.suggestions;
        state.originalQuery = Array.isArray(action.payload.originalQuery) ? action.payload.originalQuery.join(", ") : action.payload.originalQuery;
        state.usedQuery = Array.isArray(action.payload.usedQuery) ? action.payload.usedQuery.join(", ") : action.payload.usedQuery;
        state.usedSpellCheck = action.payload.usedSpellCheck;
        state.isSearching = false;
      })
      .addCase(fetchSearchAndRelatedResults.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
        state.relatedResults = [];
        state.usedSpellCheck = false;
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isSearching = true;
        state.results = [];
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.results = generateSolrObjectList(action.payload.results);
        state.originalQuery = action.payload.originalQuery;
        state.usedQuery = action.payload.usedQuery;
        state.usedSpellCheck = action.payload.usedSpellCheck;
        state.isSearching = false;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
        state.usedSpellCheck = false;
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
        state.sortBy = null;
        state.sortOrder = null;
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
      });
  },
});

export const {
  setSchema,
  setQuery,
  setInputValue,
  setThoughts,
  setFilterQueries,
  setSortBy,
  setSortOrder,
  setBbox,
  setVisOverlays,
  setVisLyrs,
  setSubject,
  setSpatialResolution,
  setIndexYear,
  setSpellCheck,
  setOriginalQuery,
  setUsedQuery,
  setUsedSpellCheck,
  resetQuerySearch,
  setIsSearching,
} = searchSlice.actions;

export default searchSlice.reducer;
