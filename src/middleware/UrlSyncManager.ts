import { ActionConfig, actionConfig } from "./actionConfig";
import { AnyAction } from "@reduxjs/toolkit";
export class UrlSyncManager {

  private isClient: boolean;
  private dispatch: ((action: AnyAction) => void) | null = null;
  private initialLoad: boolean = true;
  private lastProcessedUrl: string = "";
  private historyStack: string[] = [];

  constructor() {
    this.isClient = typeof window !== "undefined";
    if (this.isClient) {
      this.lastProcessedUrl = window.location.pathname + window.location.search;
      this.historyStack.push(this.lastProcessedUrl);
    }
  }

  private cleanTimestamp(value: string): string {
    if (value.includes(":") && /:[0-9]{13}$/.test(value)) {
      const cleanValue = value.split(":")[0];
      return cleanValue;
    }
    return value;
  }

  syncToUrl(action: AnyAction, config: ActionConfig): void {
    if (!this.isClient) return;
    const searchParams = new URLSearchParams(window.location.search);
    if (
      action.payload !== undefined &&
      action.payload !== null &&
      action.payload !== "" &&
      (typeof action.payload !== "object" ||
        (Array.isArray(action.payload) && action.payload.length > 0) ||
        Object.keys(action.payload).length > 0)
    ) {
      let paramValue = config.transform
        ? config.transform.toUrl(action.payload)
        : action.payload;
      if (typeof paramValue === "string") {
        paramValue = this.cleanTimestamp(paramValue);
      }
      if (
        paramValue !== undefined &&
        paramValue !== null &&
        paramValue !== ""
      ) {
        searchParams.set(config.param, paramValue);
      } else {
        searchParams.delete(config.param);
      }
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

  setDispatch(dispatch: (action: AnyAction) => void): void {
    this.dispatch = dispatch;
  }

  private cleanUrlParameters(searchParams: URLSearchParams): URLSearchParams {
    const cleanedParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (value === null || value === undefined || value === "") {
        return;
      }
      if (
        typeof value === "string" &&
        value.includes(":") &&
        /:[0-9]{13}$/.test(value)
      ) {
        const cleanValue = value.split(":")[0];
        if (cleanValue && cleanValue.trim() !== "") {
          cleanedParams.set(key, cleanValue);
        }
      } else if (value && value.trim() !== "") {
        cleanedParams.set(key, value);
      }
    });
    return cleanedParams;
  }

  initializeFromUrl(dispatch: (action: AnyAction) => void): void {
    if (!this.isClient) return;
    if (!this.dispatch) {
      this.setDispatch(dispatch);
    }
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl === this.lastProcessedUrl && !this.initialLoad) return;
    const rawParams = new URLSearchParams(window.location.search);
    const params = this.cleanUrlParameters(rawParams);
    const historyState = window.history.state || {};
    const previousMode = historyState.mode;
    const hasHistoryState = historyState.query;
    const previousQueryFromState = historyState.previousQuery;
    const goingToStandardMode = previousMode === "standard";
    if (goingToStandardMode && params.has("ai_search")) {
      params.delete("ai_search");
      if (hasHistoryState && !params.has("query")) {
        params.set("query", historyState.query);
      } else if (previousQueryFromState) {
        params.set("query", previousQueryFromState);
      }
    } else if (
      hasHistoryState &&
      !params.has("query") &&
      !params.has("ai_search")
    ) {
      params.set("query", historyState.query);
    } else if (
      previousQueryFromState &&
      !params.has("query") &&
      !params.has("ai_search")
    ) {
      params.set("query", previousQueryFromState);
    }
    if (
      rawParams.toString() !== params.toString() ||
      hasHistoryState ||
      previousQueryFromState ||
      goingToStandardMode
    ) {
      const cleanedUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState(
        {
          ...historyState,
          path: cleanedUrl,
          timestamp: Date.now(),
          cleaned: true,
          mode:
            goingToStandardMode || !params.has("ai_search")
              ? "standard"
              : historyState.mode,
        },
        "",
        cleanedUrl
      );
    }

    const isEmptySearch = currentUrl === "/search" || currentUrl === "/search?";
    const urlHasQuery = params.has("query");
    const actionsToDispatch: AnyAction[] = [];

    if (isEmptySearch && !urlHasQuery && !this.initialLoad) {
      Object.entries(actionConfig)
        .filter(([_, config]) => config.syncWithUrl)
        .forEach(([actionType, config]) => {
          if (config.isFilter) {
            const emptyPayload = config.transform
              ? config.transform.fromUrl("")
              : Array.isArray([])
              ? []
              : "";
            actionsToDispatch.push({
              type: actionType,
              payload: emptyPayload,
            });
          }
        });
      actionsToDispatch.push({
        type: "search/setQuery",
        payload: "*",
      });
      actionsToDispatch.push({
        type: "search/setAISearch",
        payload: false,
      });
      actionsToDispatch.push({
        type: "ui/setShowDetailPanel",
        payload: "",
      });
    } else {
      Object.entries(actionConfig)
        .filter(([_, config]) => config.syncWithUrl && !config.isFilter)
        .forEach(([actionType, config]) => {
          const value = params.get(config.param);
          if (value !== null) {
            const cleanValue = this.cleanTimestamp(value);
            const payload = config.transform
              ? config.transform.fromUrl(cleanValue)
              : cleanValue;
            actionsToDispatch.push({
              type: actionType,
              payload,
            });
          }
        });
      Object.entries(actionConfig)
        .filter(([_, config]) => config.syncWithUrl && config.isFilter)
        .forEach(([actionType, config]) => {
          const value = params.get(config.param);
          if (value !== null) {
            const cleanValue = this.cleanTimestamp(value);
            const payload = config.transform
              ? config.transform.fromUrl(cleanValue)
              : cleanValue;
            actionsToDispatch.push({
              type: actionType,
              payload,
            });
          }
        });
      const aiSearchParam = params.get("ai_search");
      if (aiSearchParam !== null && !goingToStandardMode) {
        const aiSearchValue = aiSearchParam === "true";
        actionsToDispatch.push({
          type: "search/setAISearch",
          payload: aiSearchValue,
        });
      } else {
        if (urlHasQuery || goingToStandardMode) {
          actionsToDispatch.push({
            type: "search/setAISearch",
            payload: false,
          });
        }
      }
      const showParam = params.get("show");
      if (showParam !== null && showParam.trim() !== "") {
        actionsToDispatch.push({
          type: "ui/setShowDetailPanel",
          payload: showParam,
        });
      } else {
        actionsToDispatch.push({
          type: "ui/setShowDetailPanel",
          payload: "",
        });
      }
    }
    if (actionsToDispatch.length > 0) {
      actionsToDispatch.forEach((action) => {
        this.dispatch && this.dispatch(action);
      });
    }
    this.lastProcessedUrl = currentUrl;
    this.initialLoad = false;
  }

  batchResetFiltersInUrl(
    query: string,
    preserveSubject = false,
    subject?: string[]
  ): void {
    if (!this.isClient) return;
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(actionConfig)
      .filter(([_, config]) => config.syncWithUrl && config.isFilter)
      .forEach(([_, config]) => {
        if (
          preserveSubject &&
          config.param === "subject" &&
          subject &&
          subject.length > 0
        ) {
          searchParams.set(config.param, subject.join(","));
        } else {
          searchParams.delete(config.param);
        }
      });
    if (query && query.trim() !== "") {
      searchParams.set("query", query);
    } else {
      searchParams.delete("query");
    }
    this.updateUrl(searchParams);
  }

  private updateUrl(searchParams: URLSearchParams): void {
    if (!this.isClient) return;
    try {
      const cleanedParams = new URLSearchParams();
      let hasNonEmptyParams = false;
      searchParams.forEach((value, key) => {
        if (value === null || value === undefined || value === "") {
          return;
        }
        if (
          typeof value === "string" &&
          value.includes(":") &&
          /:[0-9]{13}$/.test(value)
        ) {
          const cleanValue = value.split(":")[0];
          if (cleanValue && cleanValue.trim() !== "") {
            cleanedParams.set(key, cleanValue);
            hasNonEmptyParams = true;
          }
        } else if (value && value.trim() !== "") {
          cleanedParams.set(key, value);
          hasNonEmptyParams = true;
        }
      });
      const basePath = window.location.pathname;
      const newUrl = hasNonEmptyParams
        ? `${basePath}?${cleanedParams.toString()}`
        : basePath;
      if (newUrl === window.location.pathname + window.location.search) {
        return;
      }
      if (newUrl === "/search" || newUrl === "/search/") {
        window.history.pushState(
          { path: basePath, timestamp: Date.now() },
          "",
          basePath
        );
        this.lastProcessedUrl = basePath;
        return;
      }
      window.history.pushState(
        { path: newUrl, timestamp: Date.now() },
        "",
        newUrl
      );
      this.lastProcessedUrl = newUrl;
      this.historyStack.push(newUrl);
      if (this.historyStack.length > 20) {
        this.historyStack.shift();
      }
    } catch (error) {
      console.error("Error updating URL", error);
    }
  }
}

const urlSyncManager = new UrlSyncManager();
export default urlSyncManager;
