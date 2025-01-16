import { RootState } from "@/store";
import {
  atomicResetAndFetch,
  fetchSearchResults,
} from "@/store/slices/searchSlice";
import { actionConfig } from "./actionConfig";
import { createSelector } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined"; // prevent build error

const getStateKeyFromAction = (actionType: string): string => {
  const key = actionType.split("/")[1];
  return key.replace("set", "").charAt(0).toLowerCase() + key.slice(4);
};

const selectSpatialResolution = (state: RootState) =>
  state.search.spatialResolution;
const selectSubject = (state: RootState) => state.search.subject;
const setBbox = (state: RootState) => state.search.bbox;
const setIndexYear = (state: RootState) => state.search.indexYear;

export const getFilterState = createSelector(
  [selectSpatialResolution, selectSubject, setBbox, setIndexYear],
  (spatialResolution, subject, bbox, indexYear) => ({
    spatialResolution,
    subject,
    bbox,
    indexYear,
  })
);

export const getFilterStatus = createSelector(
  [getFilterState],
  (filterState) => {
    const activeFilters: { [key: string]: boolean } = {};
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl)
      .forEach(([actionType]) => {
        const stateKey = getStateKeyFromAction(actionType);
        const value = filterState[stateKey];
        activeFilters[stateKey] = Array.isArray(value)
          ? value.length > 0
          : Boolean(value);
      });
    if (isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      Object.entries(actionConfig)
        .filter(([_, config]) => config.syncWithUrl)
        .forEach(([actionType, config]) => {
          const stateKey = getStateKeyFromAction(actionType);
          const urlValue = urlParams.get(config.param);
          if (urlValue !== null) {
            const transformedValue = config.transform
              ? config.transform.fromUrl(urlValue)
              : urlValue;
            activeFilters[stateKey] = Array.isArray(transformedValue)
              ? transformedValue.length > 0
              : Boolean(transformedValue);
          }
        });
    }
    return {
      hasActiveFilters: Object.values(activeFilters).some((value) => value),
      activeFilters,
    };
  }
);

export const generateFilterQueries = (searchState: any) => {
  const queries = [];
  if (searchState.spatialResolution?.length) {
    searchState.spatialResolution.forEach((value: string) => {
      queries.push({
        attribute: "spatial_resolution",
        value,
      });
    });
  }
  if (searchState.subject?.length) {
    searchState.subject.forEach((value: string) => {
      queries.push({
        attribute: "subject",
        value,
      });
    });
  }
  if (searchState.bbox) {
    let bboxValues: number[];
    if (typeof searchState.bbox === "string") {
      bboxValues = searchState.bbox.split(",").map(Number);
    } else if (Array.isArray(searchState.bbox)) {
      bboxValues = searchState.bbox.map(Number);
    }
    if (
      bboxValues &&
      bboxValues.length === 4 &&
      bboxValues.every((v) => !isNaN(v))
    ) {
      queries.push({
        attribute: "bbox",
        value: bboxValues,
      });
    }
  }
  if (searchState.indexYear?.length) {
    if (
      typeof searchState.indexYear === "string" &&
      searchState.indexYear.includes("-")
    ) {
      const [start, end] = searchState.indexYear.split("-").map(Number);
      const years = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
      years.forEach((year) => {
        queries.push({
          attribute: "index_year",
          value: year.toString(),
        });
      });
    } else {
      searchState.indexYear.forEach((value: string | number) => {
        queries.push({
          attribute: "index_year",
          value: value.toString(),
        });
      });
    }
  }
  return queries;
};

export const selectSearchState = createSelector(
  [
    (state: RootState) => state.search.isSearching,
    (state: RootState) => state.search.isSuggesting,
    (state: RootState) => state.search.results,
    (state: RootState) => state.search.query,
    (state: RootState) => state.search.relatedResults,
    (state: RootState) => state.search.schema,
  ],
  (isSearching, isSuggesting, results, query, relatedResults, schema) => ({
    isSearching,
    isSuggesting,
    results,
    query,
    relatedResults,
    schema,
  })
);

export const resetFilters = async (store: any) => {
  const state = store.getState();
  await store.dispatch(atomicResetAndFetch(state.search.schema));
  const filterActions = Object.entries(actionConfig)
    .filter(([_, config]) => config.isFilter)
    .map(([actionType]) => {
      const payload = actionType === "search/setBbox" ? null : [];
      return {
        type: actionType,
        payload,
      };
    });
  filterActions.forEach((action) => {
    store.dispatch(action);
  });
  store.dispatch({type: "search/setMapPreview", payload: []})
  if (isBrowser) {
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl)
      .forEach(([_, config]) => {
        searchParams.delete(config.param);
      });
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }
  await store.dispatch(
    fetchSearchResults({
      query: state.search.query || "*",
      filterQueries: [],
      schema: state.search.schema,
      sortBy: null,
      sortOrder: null,
    })
  );
};
export const hasActiveFilters = (state: RootState): boolean => {
  return getFilterStatus(state).hasActiveFilters;
};
