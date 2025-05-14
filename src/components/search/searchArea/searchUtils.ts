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
  if (isSearchBlocked) {
    return;
  }
  dispatch(clearSearch());
  if (isBrowser) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("query");
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }
};

export const handleModeSwitch = (
  dispatch: AppDispatch,
  isSearchBlocked: boolean,
  aiSearch: boolean,
  plausible: any,
  eventType: string
) => {
  if (isSearchBlocked) {
    return;
  }
  const newValue = !aiSearch;
  dispatch(setAISearch(newValue));
  dispatch(setThoughts(""));
  dispatch(setInputValue(""));
  dispatch(setUsedSpellCheck(false));
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