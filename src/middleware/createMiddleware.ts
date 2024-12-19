import { AnyAction, Middleware } from "redux";
import {
  fetchSearchAndRelatedResults,
  fetchSearchResults,
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
    if (action.type === "search/setSchema") {
      const result = next(action);
      initializeFromUrl(store);
      triggerFetch(store);
      return result;
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

function triggerFetch(store: any) {
  const state = store.getState();
  if (state.search.schema) {
    store.dispatch(
      fetchSearchResults({
        query: state.search.query || "*",
        filterQueries: generateFilterQueries(state.search),
        schema: state.search.schema,
        sortBy: state.search.sortBy,
        sortOrder: state.search.sortOrder,
      })
    );
  }
}

async function triggerResultsRelatesFetch(store: any, query: string) {
  const state = store.getState();
  if (!state.search.schema) return;

  store.dispatch(setIsSearching(true));
  try {
    await store.dispatch(
      fetchSearchAndRelatedResults({
        query: query || "*",
        filterQueries: generateFilterQueries(state.search),
        schema: state.search.schema,
        sortBy: state.search.sortBy,
        sortOrder: state.search.sortOrder,
      })
    );
  } finally {
    store.dispatch(setIsSearching(false));
  }
}
