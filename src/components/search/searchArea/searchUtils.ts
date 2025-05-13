import { AppDispatch } from "@/store";
import { 
  clearSearch, 
  setAISearch, 
  setThoughts, 
  setUsedSpellCheck,
  setInputValue
} from "@/store/slices/searchSlice";

export const MAX_SEARCH_LENGTH = 100;

export const handleClearSearch = (
  dispatch: AppDispatch,
  isSearchBlocked: boolean,
  isBrowser: boolean
) => {
  if (isSearchBlocked) return;
  
  dispatch(clearSearch());
  
  if (isBrowser) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("query");
    const paramString = searchParams.toString();
    const newUrl = paramString ? 
      `${window.location.pathname}?${paramString}` : 
      window.location.pathname;
    window.history.pushState(
      { path: newUrl, timestamp: Date.now() },
      "",
      newUrl
    );
  }
};

export const shouldBlockAiMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const historyState = window.history.state || {};
  return historyState.forceStandardMode === true ||
         historyState.mode === 'standard' ||
         historyState.isSearchState === true;
};

export const handleModeSwitch = (
  dispatch: AppDispatch,
  isSearchBlocked: boolean,
  aiSearch: boolean,
  plausible: any,
  eventType: string
) => {
  if (isSearchBlocked) return;
  const newValue = !aiSearch;
  if (typeof window !== 'undefined') {
    if (!aiSearch) {
      const searchParams = new URLSearchParams(window.location.search);
      const currentQuery = searchParams.get('query');
      if (currentQuery && currentQuery !== '*') {
        const queryOnlyParams = new URLSearchParams();
        queryOnlyParams.set('query', currentQuery);
        const queryOnlyUrl = `${window.location.pathname}?${queryOnlyParams.toString()}`;
        window.history.replaceState(
          { 
            path: queryOnlyUrl,
            timestamp: Date.now(),
            query: currentQuery,
            isSearchState: true,
            mode: 'standard',
            forceStandardMode: true
          },
          "",
          queryOnlyUrl
        );
      }
    }
  }
  dispatch(setAISearch(newValue));
  dispatch(setThoughts(""));
  dispatch(setInputValue(""));
  dispatch(setUsedSpellCheck(false));
  dispatch({
    type: 'ui/setShowDetailPanel',
    payload: ''
  });
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const originalQuery = searchParams.get('query') || '*';
    const cleanedParams = new URLSearchParams();
    if (newValue) {
      cleanedParams.set("ai_search", "true");
    }
    const paramString = cleanedParams.toString();
    const newUrl = paramString ? 
      `${window.location.pathname}?${paramString}` : 
      window.location.pathname;
    window.history.pushState(
      { 
        path: newUrl, 
        timestamp: Date.now(), 
        mode: newValue ? 'ai' : 'standard',
        previousQuery: originalQuery !== '*' ? originalQuery : undefined,
        isInitial: !newValue // Mark as initial page when returning to standard mode
      },
      "",
      newUrl
    );
  }
  plausible(eventType, {
    props: {
      aiSearch: !!newValue,
    },
  });
};

export const isSearchBlocked = (
  isLocalLoading: boolean, 
  isSearching: boolean, 
  relatedResultsLoading: boolean, 
  aiSearch: boolean
) => {
  return (isLocalLoading || isSearching || relatedResultsLoading) && aiSearch;
};

export const isSearchAllowed = (
  aiSearch: boolean,
  inputValue: string,
  maxLength: number
) => {
  return !(
    aiSearch &&
    (!inputValue ||
      inputValue.length > maxLength ||
      inputValue.length === 0 ||
      inputValue === "*")
  );
}; 