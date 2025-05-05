import { FC, useEffect, useRef, useCallback } from "react";
import HistorySyncController from "./HistorySyncController";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  fetchSearchAndRelatedResults,
  setQuery,
} from "@/store/slices/searchSlice";

interface SearchAppProps {
  enableHistorySync?: boolean;
  children: React.ReactNode;
}

const SearchApp: FC<SearchAppProps> = ({
  enableHistorySync = true,
  children,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { query, filterQueries, schema, sort, aiSearch } = useSelector(
    (state: RootState) => state.search
  );
  const prevPathRef = useRef<string>("");
  const navigationSourceRef = useRef<"popstate" | "router" | null>(null);

  const cleanUrlParameters = useCallback((
    searchParams: URLSearchParams
  ): URLSearchParams => {
    const cleanedParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (value === null || value === undefined || value === "") {
        return;
      }
      if (value.includes(":") && /:[0-9]{13}$/.test(value)) {
        const cleanValue = value.split(":")[0];
        if (cleanValue && cleanValue.trim() !== "") {
          cleanedParams.set(key, cleanValue);
        }
      } else if (value && value.trim() !== "") {
        cleanedParams.set(key, value);
      }
    });
    return cleanedParams;
  }, []);

  const resetSearchUI = useCallback(() => {
    if (!schema) return;
    dispatch({
      type: "ui/setShowDetailPanel",
      payload: "",
    });
    dispatch({
      type: "search/setAISearch",
      payload: false,
    });
    dispatch(setQuery(""));
    dispatch(
      fetchSearchAndRelatedResults({
        query: "*",
        filterQueries: [],
        schema,
        sortBy: sort?.sortBy,
        sortOrder: sort?.sortOrder,
        bypassSpellCheck: false,
      }) as any
    );
  }, [dispatch, schema, sort?.sortBy, sort?.sortOrder]);

  const syncUIWithUrlParams = useCallback((params: URLSearchParams) => {
    const detailId = params.get("show");
    dispatch({
      type: "ui/setShowDetailPanel",
      payload: detailId || "",
    });
    const historyState = window.history.state || {};
    const stateBlocksAiMode =
      historyState.mode === "standard" ||
      historyState.forceStandardMode === true ||
      historyState.isSearchState === true;
    const urlAiSearch = params.get("ai_search");
    if (stateBlocksAiMode) {
      dispatch({
        type: "search/setAISearch",
        payload: false,
      });
    } else {
      dispatch({
        type: "search/setAISearch",
        payload: urlAiSearch === "true",
      });
    }

    Object.entries(router.query)
      .filter(
        ([key]) => key !== "query" && key !== "show" && key !== "ai_search"
      )
      .forEach(([key, value]) => {
        if (!value) return;
        const actionType = `search/set${
          key.charAt(0).toUpperCase() + key.slice(1)
        }`;
        if (typeof value === "string" && value.includes("-")) {
          const [min, max] = value.split("-").map((v) => parseInt(v, 10));
          if (!isNaN(min) && !isNaN(max)) {
            dispatch({
              type: actionType,
              payload: [min, max],
            });
          }
        } else {
          dispatch({
            type: actionType,
            payload: value,
          });
        }
      });
  }, [dispatch, router.query]);

  const cleanUrl = useCallback((currentUrl: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const cleanedParams = cleanUrlParameters(searchParams);
    const paramString = cleanedParams.toString();
    const cleanedUrl = paramString
      ? `${window.location.pathname}?${paramString}`
      : window.location.pathname;
    if (cleanedUrl !== currentUrl) {
      window.history.replaceState(
        {
          ...window.history.state,
          path: cleanedUrl,
          timestamp: Date.now(),
          cleaned: true,
        },
        "",
        cleanedUrl
      );
    }
    return cleanedUrl;
  }, [cleanUrlParameters]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = (event: PopStateEvent) => {
      navigationSourceRef.current = "popstate";
      if (!schema) return;
      const historyState = event.state || {};
      const shouldForceDisableAi =
        historyState.mode === "standard" ||
        historyState.forceStandardMode === true ||
        historyState.isSearchState === true;
      if (shouldForceDisableAi && aiSearch) {
        dispatch({
          type: "search/setAISearch",
          payload: false,
        });
      }
      const searchParams = new URLSearchParams(window.location.search);
      const cleanedParams = cleanUrlParameters(searchParams);
      const urlQuery = cleanedParams.get("query");
      const detailId = cleanedParams.get("show");
      const isEmptySearch =
        window.location.pathname === "/search" &&
        (!urlQuery || urlQuery === "*") &&
        !detailId;
      if (historyState.query && !cleanedParams.has("query")) {
        cleanedParams.set("query", historyState.query);
      } else if (historyState.previousQuery && !cleanedParams.has("query")) {
        cleanedParams.set("query", historyState.previousQuery);
      }
      const paramString = cleanedParams.toString();
      const finalUrl = paramString
        ? `${window.location.pathname}?${paramString}`
        : window.location.pathname;
      if (window.location.pathname + window.location.search !== finalUrl) {
        window.history.replaceState(
          {
            ...historyState,
            path: finalUrl,
            timestamp: Date.now(),
            cleaned: true,
          },
          "",
          finalUrl
        );
      }
      if (isEmptySearch || historyState.isInitial) {
        resetSearchUI();
        return;
      }
      syncUIWithUrlParams(cleanedParams);
      const effectiveQuery =
        cleanedParams.get("query") ||
        historyState.query ||
        historyState.previousQuery ||
        "*";
      if (!aiSearch || shouldForceDisableAi) {
        if (effectiveQuery !== query) {
          dispatch(setQuery(effectiveQuery !== "*" ? effectiveQuery : ""));
        }
        dispatch(
          fetchSearchAndRelatedResults({
            query: effectiveQuery,
            filterQueries,
            schema,
            sortBy: sort?.sortBy,
            sortOrder: sort?.sortOrder,
            bypassSpellCheck: false,
          }) as any
        );
      }
      prevPathRef.current = finalUrl;
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    dispatch,
    schema,
    filterQueries,
    sort?.sortBy,
    sort?.sortOrder,
    query,
    aiSearch,
    syncUIWithUrlParams,
    resetSearchUI,
    cleanUrlParameters
  ]);
  
  useEffect(() => {
    if (!router.isReady || !schema) return;
    if (navigationSourceRef.current === "popstate") {
      navigationSourceRef.current = null;
      return;
    }
    navigationSourceRef.current = "router";
    const cleanedUrl = cleanUrl(
      window.location.pathname + window.location.search
    );
    if (prevPathRef.current === cleanedUrl) return;
    const searchParams = new URLSearchParams(
      cleanedUrl.includes("?") ? cleanedUrl.split("?")[1] : ""
    );
    syncUIWithUrlParams(searchParams);
    const urlQuery = searchParams.get("query");
    const isEmptySearch = router.pathname === "/search" && !urlQuery;
    if (isEmptySearch) {
      resetSearchUI();
    } else if (urlQuery !== query) {
      if (urlQuery) {
        dispatch(setQuery(urlQuery));
      }
      dispatch(
        fetchSearchAndRelatedResults({
          query: urlQuery || "*",
          filterQueries,
          schema,
          sortBy: sort?.sortBy,
          sortOrder: sort?.sortOrder,
          bypassSpellCheck: false,
        }) as any
      );
    }
    prevPathRef.current = cleanedUrl;
  }, [
    router.isReady,
    router.asPath,
    schema,
    router.pathname,
    cleanUrl,
    syncUIWithUrlParams,
    query,
    resetSearchUI,
    dispatch,
    filterQueries,
    sort?.sortBy,
    sort?.sortOrder,
  ]);

  return (
    <>
      <HistorySyncController enabled={enableHistorySync} />
      {children}
    </>
  );
};

export default SearchApp;
