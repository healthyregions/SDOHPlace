import { AnyAction, Middleware } from "redux";
import {
  fetchSearchAndRelatedResults,
  fetchSearchResults,
  performChatGptSearch,
  setIsSearching,
} from "@/store/slices/searchSlice";
import { generateFilterQueries } from "./filterHelper";
import { ActionConfig, actionConfig } from "./actionConfig";

const isClient = typeof window !== "undefined";
const isValidBbox = (bbox: number[] | undefined): boolean => {
  return Boolean(bbox && bbox.length === 4);
};

export const createMiddleware: Middleware =
  (store) => (next) => (action: AnyAction) => {
    if (!isClient) {
      return next(action);
    }
    if (
      action.type === "search/clearSearch/pending" ||
      action.type === "search/clearSearch/fulfilled"
    ) {
      const result = next(action);
      if (action.type === "search/clearSearch/fulfilled") {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("query");
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
      }
      return result;
    }
    /**
     * filter reset
     */
    if (
      action.type === "search/atomicResetAndFetch/pending" ||
      action.type === "search/atomicResetAndFetch/fulfilled"
    ) {
      const result = next(action);
      if (action.type === "search/atomicResetAndFetch/fulfilled") {
        const searchParams = new URLSearchParams(window.location.search);
        Object.entries(actionConfig)
          .filter(([_, config]) => config.syncWithUrl)
          .forEach(([_, config]) => {
            searchParams.delete(config.param);
          });
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
      }
      return result;
    }
    /**
     * Page initialization actions
     */
    if (action.type === "search/initialize/pending") {
      initializeFromUrl(store);
      return next(action);
    }
    if (
      action.type === "search/initialize/fulfilled" ||
      action.type === "search/setSchema"
    ) {
      return next(action);
    }
    /**
     * Handle bbox
     */
    if (action.type === "search/setBbox") {
      const result = next(action);
      const config = actionConfig[action.type];
      if (config.syncWithUrl) {
        syncToUrl(action, config);
      }
      triggerResultsRelatesFetch(store, store.getState().search.query || "*");
      return result;
    }
    /**
     * Non-initialization actions
     */
    const result = next(action);
    const config = actionConfig[action.type];
    if (config) {
      if (config.syncWithUrl) {
        syncToUrl(action, config);
      }
      if (config.requiresFetch) {
        triggerResultsRelatesFetch(store, store.getState().search.query || "*");
      }
    }
    return result;
  };

function initializeFromUrl(store: any) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(actionConfig)
    .filter(([_, config]) => config.syncWithUrl)
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
  if (action.payload && action.payload.toString().length) {
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

async function triggerResultsRelatesFetch(store: any, query: string) {
  const state = store.getState();
  if (!state.search.schema) return;

  store.dispatch(setIsSearching(true));
  try {
    if (state.search.aiSearch && (!query || query === "*")) {
      await store.dispatch(
        fetchSearchAndRelatedResults({
          query: "*",
          filterQueries: generateFilterQueries(state.search),
          schema: state.search.schema,
          sortBy: state.search.sortBy,
          sortOrder: state.search.sortOrder,
          bypassSpellCheck: false,
        })
      );
    } else {
      await store.dispatch(
        fetchSearchAndRelatedResults({
          query: query || "*",
          filterQueries: generateFilterQueries(state.search),
          schema: state.search.schema,
          sortBy: state.search.sortBy,
          sortOrder: state.search.sortOrder,
          bypassSpellCheck: false,
        })
      );
    }
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    store.dispatch(setIsSearching(false));
  }
}
