import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { batchResetFilters } from "@/store/slices/searchSlice";
import { actionConfig } from "./actionConfig";
import urlSyncManager from "./UrlSyncManager";

export interface FilterState {
  spatialResolution: string[] | null;
  subject: string[] | null;
  bbox: number[] | null;
  indexYear: string[] | null;
  [key: string]: any;
}

export interface FilterQuery {
  attribute: string;
  value: any;
}

const getStateKeyFromAction = (actionType: string): string => {
  const key = actionType.split("/")[1];
  return key.replace("set", "").charAt(0).toLowerCase() + key.slice(4);
};

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

export class FilterService {
  getFilterStatus(state: RootState): {
    hasActiveFilters: boolean;
    activeFilters: { [key: string]: boolean };
  } {
    const filterState = getFilterState(state);
    const activeFilters: { [key: string]: boolean } = {};
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl && config.isFilter)
      .forEach(([actionType]) => {
        const stateKey = getStateKeyFromAction(actionType);
        const value = filterState[stateKey];
        activeFilters[stateKey] = Array.isArray(value)
          ? value.length > 0
          : Boolean(value);
      });
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      Object.entries(actionConfig)
        .filter(([_, config]) => config.syncWithUrl && config.isFilter)
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

  generateFilterQueries(searchState: any): FilterQuery[] {
    const queries: FilterQuery[] = [];
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
  }

  async resetFilters(store: any): Promise<void> {
    const state = store.getState();
    await store.dispatch(
      batchResetFilters({
        schema: state.search.schema,
        query: state.search.query || "*",
      })
    );
    urlSyncManager.clearFilterUrlParams(true);
  }
  hasActiveFilters(state: RootState): boolean {
    return this.getFilterStatus(state).hasActiveFilters;
  }
}

const filterService = new FilterService();
export default filterService;
