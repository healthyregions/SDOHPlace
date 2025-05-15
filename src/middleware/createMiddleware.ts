import { AnyAction, Middleware } from "redux";
import { fetchSearchAndRelatedResults, setIsSearching } from "@/store/slices/searchSlice";
import filterService from "./FilterService";
import { actionConfig } from "./actionConfig";
import urlSyncManager from "./UrlSyncManager";
import queryTracker from "./QueryTracker";

const isClient = typeof window !== "undefined";

export const createMiddleware: Middleware = (store) => {
  let isInitializing = false;
  let pendingFetchTimer: NodeJS.Timeout | null = null;
  let lastFilterAction: string | null = null;

  return (next) => (action: AnyAction) => {
    if (!isClient) {
      return next(action);
    }
    if (action.type === "search/initialize/pending") {
      isInitializing = true;
      urlSyncManager.initializeFromUrl(store.dispatch);
      return next(action);
    }
    if (action.type === "search/initialize/fulfilled") {
      isInitializing = false;
      return next(action);
    }
    if (action.type === "search/batchResetFilters") {
      const result = next(action);
      if (pendingFetchTimer) {
        clearTimeout(pendingFetchTimer);
        pendingFetchTimer = null;
      }
      urlSyncManager.batchResetFiltersInUrl(
        action.payload.query,
        action.payload.preserveSubject,
        action.payload.subject
      );
      triggerResultsFetch(store, action.payload.query);
      return result;
    }
    const result = next(action);
    const config = actionConfig[action.type];
    if (config) {
      if (config.syncWithUrl) {
        urlSyncManager.syncToUrl(action, config);
      }
      if (config.requiresFetch && !isInitializing) {
        const state = store.getState();
        if (!state.search.isSearching) {
          if (pendingFetchTimer) {
            clearTimeout(pendingFetchTimer);
            pendingFetchTimer = null;
          }
          const isFilterAction = config.isFilter;
          const debounceTime = isFilterAction ? 5 : 20;
          if (isFilterAction) {
            lastFilterAction = action.type;
          }
          pendingFetchTimer = setTimeout(() => {
            const currentState = store.getState();
            const currentQuery = currentState.search.query || "*";
            triggerResultsFetch(store, currentQuery);
            pendingFetchTimer = null;
            lastFilterAction = null;
          }, debounceTime);
        }
      }
    }
    return result;
  };
};

async function triggerResultsFetch(
  store: any,
  query: string,
  bypassSpellCheck = false
): Promise<void> {
  const state = store.getState();
  if (!state.search.schema) return;
  if (state.search.isSearching) return;
  const filterQueries = filterService.generateFilterQueries(state.search);
  const queryKey = queryTracker.generateQueryKey(
    query,
    filterQueries,
    state.search.sort.sortBy,
    state.search.sort.sortOrder
  );
  if (!queryTracker.shouldExecuteQuery(queryKey)) return;
  try {
    queryTracker.addInFlight(queryKey);
    queryTracker.addRecent(queryKey);
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
    queryTracker.removeInFlight(queryKey);
    store.dispatch(setIsSearching(false));
    queryTracker.cleanup();
  }
}
