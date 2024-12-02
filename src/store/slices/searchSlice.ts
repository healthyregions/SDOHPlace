import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SolrQueryBuilder from "../../components/search/helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import { initialState, SolrSuggestResponse } from "@/store/types/search";


export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async ({
    query,
    filterQueries,
    schema,
    sortBy,
    sortOrder
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
    return results.map(result => ({
      ...result,
      years: Array.isArray(result.years) ? result.years : Array.from(result.years || [])
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
  async ({ query, schema }: { query: string; schema: any }) => {
    const searchQueryBuilder = new SolrQueryBuilder();
    searchQueryBuilder.setSchema(schema);
    const suggestResult = await searchQueryBuilder
      .suggestQuery(query)
      .fetchResult();
    const suggestResponse = suggestResult as unknown as SolrSuggestResponse;
    const suggestions =
      suggestResponse.suggest?.sdohSuggester[query]?.suggestions || [];
    const validSuggestions = suggestions
      .filter(
        (suggestion) =>
          suggestion.weight >= 50 &&
          suggestion.term !== query &&
          suggestion.payload === "false"
      )
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10);
    const relatedResults = [];
    for (const suggestion of validSuggestions) {
      const results = await searchQueryBuilder
        .generalQuery(suggestion.term)
        .fetchResult();
      relatedResults.push(...results);
    }
    return relatedResults;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
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
    setBboxParam: (state, action) => {
      state.bboxParam = action.payload;
    },
    setBboxSearch: (state, action) => {
      state.bboxSearch = action.payload;
    },
    setSpatialResolution: (state, action) => {
      state.spatialResolution = action.payload;
    },
    resetQuerySearch: (state) => {
      return {
        ...initialState,
        query: '*'
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
      state.isSearching = true;
      state.results = [];
    })
    .addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.results = generateSolrObjectList(
        action.payload,
        state.sortBy,
        state.sortOrder
      );
      state.isSearching = false;
    })
    .addCase(fetchSearchResults.rejected, (state) => {
      state.isSearching = false;
      state.results = [];
    })
    .addCase (fetchRelatedResults.pending, (state) => {
      state.isRecommending = true; 
      state.relatedResults = [];
    })
    .addCase(fetchRelatedResults.fulfilled, (state, action) => {
      state.relatedResults = generateSolrObjectList(
        action.payload,
        state.sortBy,
        state.sortOrder
      );
      state.isRecommending = false;
    })
    .addCase(fetchRelatedResults.rejected, (state) => {
      state.isRecommending = false;
      state.relatedResults = [];
    })
    .addCase(fetchSuggestions.pending, (state) => {
      
    })
     .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
      })
    .addCase(fetchSuggestions.fulfilled, (state, action) => {
      state.suggestions = action.payload;
    });
  },
});

export const {
  setQuery,
  setInputValue,
  setFilterQueries,
  setSortBy,
  setSortOrder,
  setBboxParam,
  setBboxSearch,
  setSpatialResolution,
  resetQuerySearch,
} = searchSlice.actions;

export default searchSlice.reducer;