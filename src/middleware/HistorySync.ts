import { AnyAction } from "@reduxjs/toolkit";
import urlSyncManager from "./UrlSyncManager";
import { fetchSearchAndRelatedResults } from "@/store/slices/searchSlice";

const isClient = typeof window !== "undefined";

export class HistorySync {
  private enabled: boolean;
  private dispatch: ((action: AnyAction) => void) | null = null;
  private store: any = null;
  private historyInitialized: boolean = false;
  constructor(enabled = true) {
    this.enabled = enabled;
  }
  enable(): void {
    if (this.enabled) return;
    this.enabled = true;
  }
  disable(): void {
    if (!this.enabled) return;
    this.enabled = false;
  }
  setDispatch(dispatch: (action: AnyAction) => void, store?: any): void {
    this.dispatch = dispatch;
    if (store) {
      this.store = store;
      if (!this.historyInitialized && isClient) {
        this.initializeHistoryStack();
      }
    }
    urlSyncManager.setDispatch(dispatch);
  }
  private initializeHistoryStack(): void {
    if (!isClient || !this.enabled || this.historyInitialized) return;
    try {
      const currentUrl = window.location.pathname + window.location.search;
      if (window.location.pathname === '/search' && window.location.search && window.history.length <= 2) {
        window.history.replaceState(
          { path: currentUrl, timestamp: Date.now(), current: true },
          "",
          currentUrl
        );
        window.history.pushState(
          { path: '/search', timestamp: Date.now() - 1000, isInitial: true },
          "",
          '/search'
        );
        window.history.pushState(
          { path: currentUrl, timestamp: Date.now(), hasParams: true },
          "",
          currentUrl
        );
      } else if (window.location.pathname !== '/search' && window.history.length <= 1) {
        window.history.pushState(
          { path: '/search', timestamp: Date.now() - 1000, isInitial: true },
          "",
          '/search'
        );
        window.history.pushState(
          { path: currentUrl, timestamp: Date.now() },
          "",
          currentUrl
        );
      }
      this.historyInitialized = true;
    } catch (error) {
      console.error('Error initializing history stack', error);
    }
  }
  resetSearchState(): void {
    if (!this.dispatch || !this.store) return;
    try {
      this.dispatch({
        type: 'search/setQuery',
        payload: '*'
      });
      const searchState = this.store.getState().search;
      if (searchState && searchState.schema) {
        Object.entries(searchState)
          .filter(([key, _]) => key !== 'query' && key !== 'schema' && key !== 'sort' && typeof key === 'string')
          .forEach(([key, value]) => {
            if (Array.isArray(value)) {
              this.dispatch({
                type: `search/set${key.charAt(0).toUpperCase() + key.slice(1)}`,
                payload: []
              });
            }
          });
        const action = fetchSearchAndRelatedResults({
          query: '*',
          filterQueries: [],
          schema: searchState.schema,
          sortBy: searchState.sort?.sortBy,
          sortOrder: searchState.sort?.sortOrder,
          bypassSpellCheck: false,
        });
        this.dispatch(action as any);
      }
    } catch (error) {
      console.error('Error resetting search state', error);
    }
  }
}
const historySync = new HistorySync();
export default historySync; 