import filterService from './FilterService';
import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const generateFilterQueries = filterService.generateFilterQueries.bind(filterService);
export const getFilterStatus = filterService.getFilterStatus.bind(filterService);
export const resetFilters = filterService.resetFilters.bind(filterService);
export const hasActiveFilters = filterService.hasActiveFilters.bind(filterService);

const selectSpatialResolution = (state: RootState) =>
  state.search.spatialResolution;
const selectSubject = (state: RootState) => state.search.subject;
const selectBbox = (state: RootState) => state.search.bbox;
const selectIndexYear = (state: RootState) => state.search.indexYear;

export const getFilterState = createSelector(
  [selectSpatialResolution, selectSubject, selectBbox, selectIndexYear],
  (spatialResolution, subject, bbox, indexYear) => ({
    spatialResolution,
    subject,
    bbox,
    indexYear,
  })
);

export const selectSearchState = createSelector(
  [
    (state: RootState) => state.search.isSearching,
    (state: RootState) => state.search.isSuggesting,
    (state: RootState) => state.search.results,
    (state: RootState) => state.search.query,
    (state: RootState) => state.search.relatedResults,
    (state: RootState) => state.search.schema,
    (state: RootState) => state.search.aiSearch,
  ],
  (isSearching, isSuggesting, results, query, relatedResults, schema, aiSearch) => ({
    isSearching,
    isSuggesting,
    results,
    query,
    relatedResults,
    schema,
    aiSearch,
  })
);

export default {
  generateFilterQueries,
  getFilterStatus,
  resetFilters,
  hasActiveFilters,
  getFilterState,
  selectSearchState,
};
