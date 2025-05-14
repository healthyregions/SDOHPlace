import { ActionConfig, actionConfig } from "./actionConfig";
import { AnyAction } from "@reduxjs/toolkit";

export class UrlSyncManager {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
  }

  syncToUrl(action: AnyAction, config: ActionConfig): void {
    if (!this.isClient) return;
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
    
    this.updateUrl(searchParams);
  }

  clearUrlParams(): void {
    if (!this.isClient) return;
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl)
      .forEach(([_, config]) => {
        searchParams.delete(config.param);
      });
    this.updateUrl(searchParams);
  }

  clearFilterUrlParams(preserveQuery = true): void {
    if (!this.isClient) return;
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl && config.isFilter)
      .forEach(([_, config]) => {
        searchParams.delete(config.param);
      });
    if (!preserveQuery) {
      searchParams.delete("query");
    }
    this.updateUrl(searchParams);
  }

  initializeFromUrl(dispatch: (action: AnyAction) => void): void {
    if (!this.isClient) return;
    const params = new URLSearchParams(window.location.search);
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl && !config.isFilter)
      .forEach(([actionType, config]) => {
        const value = params.get(config.param);
        if (value !== null) {
          dispatch({
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
          dispatch({
            type: actionType,
            payload: config.transform ? config.transform.fromUrl(value) : value,
          });
        }
      });
  }

  batchResetFiltersInUrl(query: string, preserveSubject = false, subject?: string[]): void {
    if (!this.isClient) return;
    const searchParams = new URLSearchParams(window.location.search);
    if (query === "*") {
      searchParams.delete("query");
    } else if (query) {
      searchParams.set("query", query);
    }
    if (preserveSubject && subject && Array.isArray(subject) && subject.length > 0) {
      searchParams.set("subject", subject.join(","));
    } else {
      searchParams.delete("subject");
    }
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl && config.isFilter && config.param !== "subject")
      .forEach(([_, config]) => {
        searchParams.delete(config.param);
      });
    this.updateUrl(searchParams);
  }

  private updateUrl(searchParams: URLSearchParams): void {
    if (!this.isClient) return;
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }
}

const urlSyncManager = new UrlSyncManager();
export default urlSyncManager; 