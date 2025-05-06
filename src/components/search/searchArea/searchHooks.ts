import * as React from "react";
import { debounce } from "@mui/material";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchAndRelatedResults,
  fetchSuggestions,
  setQuery,
  setInputValue,
  setIsSearching,
  setRelatedResultsLoading,
} from "@/store/slices/searchSlice";
import { setShowDetailPanel, clearMapPreview } from "@/store/slices/uiSlice";
import { usePlausible } from "next-plausible";
import { EventType } from "@/lib/event";

interface UseSearchProps {
  schema: any;
}

export const useSearch = ({ schema }: UseSearchProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const [isLocalLoading, setIsLocalLoading] = React.useState(false);
  const searchInProgressRef = React.useRef<boolean>(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pendingSearchRef = React.useRef<string | null>(null);

  const {
    aiSearch,
    query,
    filterQueries,
    sort,
    inputValue,
  } = useSelector((state: RootState) => state.search);

  const clearSuggestions = React.useCallback(() => {
    dispatch({ type: "search/fetchSuggestions/fulfilled", payload: [] });
  }, [dispatch]);

  const debouncedFetchSuggestions = React.useCallback(
    debounce((value: string, schema: any, prevValue: string) => {
      if (value && value.length >= 2 && !aiSearch) {
        dispatch(fetchSuggestions({ inputValue: value, schema }));
      } else {
        clearSuggestions();
      }
    }, 300),
    [dispatch, aiSearch, clearSuggestions]
  );

  const performSearch = React.useCallback(
    async (searchValue: string | null) => {
      if (!searchValue) {
        setIsLocalLoading(false);
        dispatch(setIsSearching(false));
        dispatch(setRelatedResultsLoading(false));
        return;
      }

      if (searchInProgressRef.current) {
        pendingSearchRef.current = searchValue;
        return;
      }

      searchInProgressRef.current = true;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      clearSuggestions();
      dispatch(clearMapPreview());
      dispatch(setShowDetailPanel(null));

      const uniqueSearchId = Date.now().toString();
      dispatch(setQuery(searchValue + ":" + uniqueSearchId));
      setTimeout(() => dispatch(setQuery(searchValue)), 0);

      try {
        const result = await dispatch(
          fetchSearchAndRelatedResults({
            query: searchValue,
            filterQueries,
            schema,
            sortBy: sort.sortBy,
            sortOrder: sort.sortOrder,
            bypassSpellCheck: false,
          })
        ).unwrap();

        if (searchValue) {
          const searchEventType = aiSearch
            ? EventType.SubmittedChatSearch
            : EventType.SubmittedKeywordSearch;
          
          plausible(searchEventType, {
            props: {
              searchEvent: searchEventType + ": " + searchValue + " & " + filterQueries.join(" "),
            },
          });
        }
      } catch (error) {
        console.error("Search failed:", error);
        setIsLocalLoading(false);
        dispatch(setIsSearching(false));
        dispatch(setRelatedResultsLoading(false));
      } finally {
        searchTimeoutRef.current = setTimeout(() => {
          searchInProgressRef.current = false;
          searchTimeoutRef.current = null;
          setIsLocalLoading(false);
          dispatch(setIsSearching(false));
          
          if (pendingSearchRef.current) {
            const pendingValue = pendingSearchRef.current;
            pendingSearchRef.current = null;
            debouncedPerformSearch(pendingValue);
          }
        }, 500);
      }
    },
    [
      dispatch,
      filterQueries,
      schema,
      sort.sortBy,
      sort.sortOrder,
      aiSearch,
      plausible,
      clearSuggestions,
    ]
  );

  const debouncedPerformSearch = React.useCallback(
    debounce((searchValue: string | null) => {
      performSearch(searchValue);
    }, 300),
    [performSearch]
  );

  return {
    isLocalLoading,
    setIsLocalLoading,
    clearSuggestions,
    debouncedFetchSuggestions,
    performSearch,
    debouncedPerformSearch,
    inputValue,
  };
};

export const useDeviceDetection = () => {
  const isIOS = React.useMemo(() => {
    if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
      return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream;
    }
    return false;
  }, []);

  const isBrowser = typeof window !== "undefined";

  return { isIOS, isBrowser };
}; 