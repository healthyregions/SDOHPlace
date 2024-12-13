import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SolrQueryBuilder from "../../components/search/helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import { initialState, SolrSuggestResponse } from "@/store/types/search";

export const fetchSearchAndRelatedResults = createAsyncThunk(
  "search/fetchSearchAndRelated",
  async (
    {
      query,
      filterQueries,
      schema,
      sortBy,
      sortOrder,
    }: {
      query: string;
      filterQueries: Array<any>;
      schema: any;
      sortBy?: string;
      sortOrder?: string;
    },
    { dispatch, getState }
  ) => {
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    const suggestResult = await searchQueryBuilder
      .suggestQuery(query)
      .fetchResult();
    const suggestResponse = suggestResult as unknown as SolrSuggestResponse;
    const suggestions =
      suggestResponse.suggest?.sdohSuggester[query]?.suggestions || [];

    const validSuggestions = suggestions
      .filter((s) => s.weight > 50 && s.payload === "false")
      .map((s) => s.term)
      .sort((a, b) => {
        const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
        const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
        return weightB - weightA;
      })
      .slice(0, 10);
    searchQueryBuilder.combineQueries(query, filterQueries, sortBy, sortOrder);
    const searchResults = await searchQueryBuilder.fetchResult();
    const relatedResults = [];
    for (const suggestion of validSuggestions) {
      if (suggestion !== query) {
        const results = await searchQueryBuilder
          .generalQuery(suggestion)
          .fetchResult();
        relatedResults.push(...results);
      }
    }
    return {
      searchResults: searchResults.map((result) => ({
        ...result,
        years: Array.isArray(result.years)
          ? result.years
          : Array.from(result.years || []),
      })),
      relatedResults,
      suggestions: validSuggestions,
    };
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async ({
    query,
    filterQueries,
    schema,
    sortBy,
    sortOrder,
  }: {
    query: string;
    filterQueries: Array<any>;
    schema: any;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    searchQueryBuilder.combineQueries(query, filterQueries, sortBy, sortOrder);
    const results = await searchQueryBuilder.fetchResult();
    return results.map((result) => ({
      ...result,
      years: Array.isArray(result.years)
        ? result.years
        : Array.from(result.years || []),
    }));
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
      .filter((s) => s.weight > 50 && s.payload === "false")
      .map((s) => s.term)
      .sort((a, b) => {
        const weightA = suggestions.find((s) => s.term === a)?.weight || 0;
        const weightB = suggestions.find((s) => s.term === b)?.weight || 0;
        return weightB - weightA;
      })
      .slice(0, 10);
  }
);

export const fetchRelatedResults = createAsyncThunk(
  "search/fetchRelatedResults",
  async ({
    query,
    schema,
    suggestions,
  }: {
    query: string;
    schema: any;
    suggestions: string[];
  }) => {
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    const relatedResults = [];
    for (const suggestion of suggestions) {
      if (suggestion !== query) {
        const results = await searchQueryBuilder
          .generalQuery(suggestion)
          .fetchResult();
        relatedResults.push(...results);
      }
    }
    return relatedResults;
  }
);

export const atomicResetAndFetch = createAsyncThunk(
  "search/atomicResetAndFetch",
  async (schema: any, { dispatch }) => {
    return { schema };
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSchema: (state, action) => {
      state.schema = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
      state.suggestions = [];
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
    setBboxSearch: (state, action) => {
      state.bboxSearch = action.payload;
    },
    setBboxParam: (state, action) => {
      state.bboxParam = action.payload;
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
    resetQuerySearch: (state) => {
      return {
        ...initialState,
        query: "*",
      };
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
        state.isSearching = false;
      })
      .addCase(fetchSearchAndRelatedResults.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
        state.relatedResults = [];
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isSearching = true;
        state.results = [];
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.results = generateSolrObjectList(action.payload);
        state.isSearching = false;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
      })
      .addCase(fetchRelatedResults.pending, (state) => {
        state.isSearching = true; // recommendations and search results should come together
        state.relatedResults = [];
      })
      .addCase(fetchRelatedResults.fulfilled, (state, action) => {
        state.relatedResults = generateSolrObjectList(action.payload);
        state.isSearching = false;
      })
      .addCase(fetchRelatedResults.rejected, (state) => {
        state.isSearching = false;
        state.relatedResults = [];
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
      });
  },
});

export const {
  setSchema,
  setQuery,
  setInputValue,
  setFilterQueries,
  setSortBy,
  setSortOrder,
  setBboxSearch,
  setBboxParam,
  setVisOverlays,
  setVisLyrs,
  setSubject,
  setSpatialResolution,
  setIndexYear,
  resetQuerySearch,
  setIsSearching,
} = searchSlice.actions;

export default searchSlice.reducer;
