import { AnyAction, Middleware } from "redux";
import {
  batchResetFilters,
  fetchSearchAndRelatedResults,
  setIsSearching,
} from "@/store/slices/searchSlice";
import { generateFilterQueries } from "./filterHelper";
import { ActionConfig, actionConfig } from "./actionConfig";

const isClient = typeof window !== "undefined";

export const createMiddleware: Middleware = (store) => {
  let isInitializing = false;
  let pendingFetchTimer: NodeJS.Timeout | null = null;

  return (next) => (action: AnyAction) => {
    if (!isClient) {
      return next(action);
    }
    if (action.type === "search/initialize/pending") {
      isInitializing = true;
      initializeFromUrl(store);
      return next(action);
    }
    if (action.type === "search/initialize/fulfilled") {
      isInitializing = false;
      return next(action);
    }
    if (action.type === batchResetFilters.type) {
      const result = next(action);
      if (pendingFetchTimer) {
        clearTimeout(pendingFetchTimer);
        pendingFetchTimer = null;
      }
      // batch reset filters
      const searchParams = new URLSearchParams(window.location.search);
      if (action.payload.query === "*") {
        searchParams.delete("query");
      } else if (action.payload.query) {
        searchParams.set("query", action.payload.query);
      }
      if (action.payload.preserveSubject && action.payload.subject) {
        if (Array.isArray(action.payload.subject) && action.payload.subject.length > 0) {
          searchParams.set("subject", action.payload.subject.join(","));
        } else {
          searchParams.delete("subject");
        }
      } else {
        searchParams.delete("subject");
      }
      searchParams.delete("spatial_resolution");
      searchParams.delete("bbox");
      searchParams.delete("index_year");
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
      
      triggerResultsRelatesFetch(store, action.payload.query);
      return result;
    }
    const result = next(action);
    const config = actionConfig[action.type];
    if (config) {
      if (config.syncWithUrl) {
        syncToUrl(action, config);
      }
      if (config.requiresFetch && !isInitializing) {
        const state = store.getState();
        if (!state.search.isSearching) {
          if (pendingFetchTimer) {
            clearTimeout(pendingFetchTimer);
          }
          pendingFetchTimer = setTimeout(() => {
            triggerResultsRelatesFetch(
              store,
              store.getState().search.query || "*"
            );
            pendingFetchTimer = null;
          }, 50);
        }
      }
    }
    return result;
  };
};

function initializeFromUrl(store: any) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(actionConfig)
    .filter(([_, config]) => config.syncWithUrl && !config.isFilter)
    .forEach(([actionType, config]) => {
      const value = params.get(config.param);
      if (value !== null) {
        store.dispatch({
          type: actionType,
          payload: config.transform ? config.transform.fromUrl(value) : value,
        });
      }
    });
  Object.entries(actionConfig)
    .filter(([_, config]) => config.syncWithUrl && config.isFilter)
    .forEach(([actionType, config]) => {
      const value = params.get(config.param);
      if (value !== null) {
        store.dispatch({
          type: actionType,
          payload: config.transform ? config.transform.fromUrl(value) : value,
        });
      }
    });
}

function syncToUrl(action: AnyAction, config: ActionConfig) {
  const searchParams = new URLSearchParams(window.location.search);
  if (
    action.payload !== undefined &&
    action.payload !== null &&
    (typeof action.payload !== "object" ||
      (Array.isArray(action.payload) && action.payload.length > 0) ||
      Object.keys(action.payload).length > 0)
  ) {
    const paramValue = config.transform
      ? config.transform.toUrl(action.payload)
      : action.payload;
    searchParams.set(config.param, paramValue);
  } else {
    searchParams.delete(config.param);
  }
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, "", newUrl);
}

async function triggerResultsRelatesFetch(
  store: any,
  query: string,
  bypassSpellCheck = false
) {
  const state = store.getState();
  if (!state.search.schema) return;
  if (state.search.isSearching) return;
  const filterQueries = generateFilterQueries(state.search);
  try {
    store.dispatch(setIsSearching(true));

    if (state.search.aiSearch && (!query || query === "*")) {
      await store.dispatch(
        fetchSearchAndRelatedResults({
          query: "*",
          filterQueries: filterQueries,
          schema: state.search.schema,
          sortBy: state.search.sort.sortBy,
          sortOrder: state.search.sort.sortOrder,
          bypassSpellCheck,
        })
      );
    } else {
      await store.dispatch(
        fetchSearchAndRelatedResults({
          query: query,
          filterQueries: filterQueries,
          schema: state.search.schema,
          sortBy: state.search.sort.sortBy,
          sortOrder: state.search.sort.sortOrder,
          bypassSpellCheck,
        })
      );
    }
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    store.dispatch(setIsSearching(false));
  }
}
