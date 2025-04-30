import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Popper
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { AppDispatch, RootState } from "@/store";
import {
  setInputValue,
  setIsSearching,
  setRelatedResultsLoading,
} from "@/store/slices/searchSlice";
import {
  setShowClearButton,
} from "@/store/slices/uiSlice";
import SpellCheckMessage from "./spellCheckMessage";
import { usePlausible } from "next-plausible";
import { EventType } from "@/lib/event";
import { useSearch, useDeviceDetection } from "./searchHooks";
import { 
  handleClearSearch,
  handleModeSwitch,
  isSearchBlocked,
} from "./searchUtils";
import { CustomListbox } from "./searchUiComponents";
import SearchInput from "./SearchInput";
import AIThoughtsPanel from "./AIThoughtsPanel";

interface Props {
  schema: any;
}

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  searchBox: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    "& input": {
      fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
      "&:focus": {
        outline: "none",
        borderColor: "transparent",
        boxShadow: "none",
      },
      "&::-webkit-search-cancel-button": {
        display: "none",
      },
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiAutocomplete-option": {
      "&[aria-selected='true']": {
        backgroundColor: "transparent !important",
      },
      "&:hover": {
        backgroundColor: "#f0f0f0 !important",
      },
      "&.Mui-focused": {
        backgroundColor: "transparent !important",
      },
      "&[data-focus='true']": {
        backgroundColor: "transparent !important",
      },
    },
  },
  popper: {
    borderRadius: "1em !important",
    zIndex: 1000,
  },
  paper: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    fontColor: `${fullConfig.theme.colors["smokegray"]}`,
    fontSize: "0.875em",
    marginTop: "0.1em",
    width: "80%",
    transform: "translateX(5%)",
    zIndex: 1000,
  },
  aiModeButton: {
    color: fullConfig.theme.colors["frenchviolet"],
    "&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color: "white",
    },
    "&:hover": {
      color: fullConfig.theme.colors["frenchviolet"],
    },
    "&:hover&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color: "white",
    },
  },
  loadingButton: {
    color: fullConfig.theme.colors["frenchviolet"],
    animation: "$spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const EnhancedSearchBox = ({ schema }: Props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<HTMLDivElement>(null);
  const [isMouseInDropdown, setIsMouseInDropdown] = React.useState(false);
  const [shouldShowDropdown, setShouldShowDropdown] = React.useState(false);
  const [hasSelectedItem, setHasSelectedItem] = React.useState(false);
  const [previousInput, setPreviousInput] = React.useState("");
  const { showClearButton } = useSelector((state: RootState) => state.ui);
  const {
    aiSearch,
    query,
    inputValue,
    suggestions,
    thoughts,
    isSearching,
    relatedResultsLoading,
  } = useSelector((state: RootState) => state.search);
  const { 
    isLocalLoading, 
    setIsLocalLoading, 
    clearSuggestions, 
    debouncedFetchSuggestions, 
    performSearch, 
    debouncedPerformSearch 
  } = useSearch({ schema });
  const { isIOS, isBrowser } = useDeviceDetection();

  const handleInputReset = () => {
    if (hasSelectedItem) {
      setHasSelectedItem(false);
    }
  };

  React.useEffect(() => {
    if (query) {
      dispatch(setInputValue(query));
    }
  }, [query, dispatch]);

  React.useEffect(() => {
    if (isSearching || isLocalLoading) {
      setShouldShowDropdown(false);
      clearSuggestions();
    }
  }, [isSearching, isLocalLoading, clearSuggestions]);

  React.useEffect(() => {
    if (!aiSearch) {
      if (hasSelectedItem) {
        setShouldShowDropdown(false);
        return;
      }
      if (
        suggestions &&
        Array.isArray(suggestions) &&
        suggestions.length > 0 &&
        inputValue.length >= 2
      ) {
        setShouldShowDropdown(true);
      } else {
        setShouldShowDropdown(false);
      }
    } else {
      setShouldShowDropdown(false);
    }
  }, [
    suggestions,
    aiSearch,
    inputValue,
    hasSelectedItem,
    isSearching,
    isLocalLoading,
  ]);

  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!isMouseInDropdown && shouldShowDropdown) {
        const target = e.target as HTMLElement;
        const searchInput = textFieldRef.current;
        const autocomplete = autocompleteRef.current;
        if (
          searchInput &&
          autocomplete &&
          !searchInput.contains(target) &&
          !autocomplete.contains(target)
        ) {
          setShouldShowDropdown(false);
        }
        const elements = document.querySelectorAll(".MuiAutocomplete-option");
        elements.forEach((element) => {
          element.setAttribute("aria-selected", "false");
          element.classList.remove("Mui-focused");
          (element as HTMLElement).style.backgroundColor = "transparent";
        });
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isMouseInDropdown, shouldShowDropdown]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!aiSearch) {
      return;
    }
    setShouldShowDropdown(false);
    if (isLoading) return;
    clearSuggestions();
    setIsLocalLoading(true);
    dispatch(setIsSearching(true));
    dispatch(setRelatedResultsLoading(true));
    const originalValue = inputValue;
    if (originalValue) {
      debouncedPerformSearch(originalValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!aiSearch) {
        return;
      }
      setShouldShowDropdown(false);
      if (isLocalLoading || isSearching) return;
      clearSuggestions();
      const currentInputValue = inputValue;
      setIsLocalLoading(true);
      dispatch(setIsSearching(true));
      dispatch(setRelatedResultsLoading(true));
      if (!isMouseInDropdown) {
        dispatch(setInputValue(currentInputValue));
        if (currentInputValue) {
          debouncedPerformSearch(currentInputValue);
        }
      } else {
        if (inputValue) {
          debouncedPerformSearch(inputValue);
        }
      }
    }
  };

  const handleDropdownSelect = (event: any, value: string | null) => {
    setHasSelectedItem(true);
    setShouldShowDropdown(false);
    clearSuggestions();
    if (isLocalLoading || isSearching) {
      return;
    }
    if (value) {
      dispatch(setInputValue(value));
      if (value !== query) {
        setIsLocalLoading(true);
        dispatch(setIsSearching(true));
        debouncedPerformSearch(value);
      }
    }
  };

  const handleUserInputChange = async (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    const inputChanged = newInputValue !== inputValue;
    const lengthChanged = newInputValue.length !== inputValue.length;
    const becameShorter = newInputValue.length < inputValue.length;
    
    if (hasSelectedItem && event && event.type === "change") {
      handleInputReset();
      dispatch(setInputValue(newInputValue));
      dispatch(setShowClearButton(!!newInputValue));
      return;
    }
    
    if (
      inputChanged &&
      (lengthChanged || !newInputValue.includes(inputValue))
    ) {
      clearSuggestions();
      setShouldShowDropdown(false);
    }
    
    setPreviousInput(inputValue);
    dispatch(setInputValue(newInputValue));
    dispatch(setShowClearButton(!!newInputValue));
    
    if (newInputValue !== "") {
      if (!aiSearch) {
        if (newInputValue.length >= 2) {
          if (becameShorter) {
            clearSuggestions();
          }
          debouncedFetchSuggestions(newInputValue, schema, inputValue);
        } else if (newInputValue.length === 1) {
          setShouldShowDropdown(false);
          clearSuggestions();
        }
      }
    } else {
      handleClear();
      if (isIOS && textFieldRef.current) {
        setTimeout(() => textFieldRef.current?.focus(), 50);
      } else {
        requestAnimationFrame(() => {
          if (textFieldRef.current) {
            textFieldRef.current.blur();
            setTimeout(() => {
              textFieldRef.current?.focus();
              if (textFieldRef.current?.setSelectionRange) {
                textFieldRef.current.setSelectionRange(0, 0);
              }
            }, 100);
          }
        });
      }
    }
  };

  const searchBlockedState = isSearchBlocked(
    isLocalLoading,
    isSearching,
    relatedResultsLoading,
    aiSearch
  );

  const handleClear = () => {
    handleClearSearch(dispatch, searchBlockedState, isBrowser);
  };

  const handleSearchModeSwitch = () => {
    handleModeSwitch(
      dispatch,
      searchBlockedState,
      aiSearch,
      plausible,
      EventType.ChangedSearchMode
    );
  };

  const isLoading = isLocalLoading || isSearching || relatedResultsLoading;

  const customListbox = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
  >((props, ref) => {
    return (
      <CustomListbox
        ref={ref}
        {...props}
        onMouseEnter={() => setIsMouseInDropdown(true)}
        onMouseLeave={() => {
          setIsMouseInDropdown(false);
        }}
      />
    );
  });

  customListbox.displayName = "CustomListbox";

  const handleAutocompleteBlur = (event: React.FocusEvent) => {
    if (!isMouseInDropdown) {
      setShouldShowDropdown(false);
    }
  };

  const handleAutocompleteFocus = (event: React.FocusEvent) => {
    if (hasSelectedItem) {
      return;
    }
    if (inputValue && inputValue.length >= 2 && !aiSearch) {
      debouncedFetchSuggestions(inputValue, schema, previousInput);
    }
  };

  return (
    <div className="flex flex-col w-full sm:mt-6">
      <SpellCheckMessage />
      <SearchInput 
        textFieldRef={textFieldRef}
        inputValue={inputValue}
        aiSearch={aiSearch}
        query={query}
        suggestions={suggestions}
        isLoading={isLoading}
        showClearButton={showClearButton}
        onUserInputChange={handleUserInputChange}
        onDropdownSelect={handleDropdownSelect}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        handleClear={handleClear}
        handleModeSwitch={handleSearchModeSwitch}
        shouldShowDropdown={shouldShowDropdown}
        autocompleteRef={autocompleteRef}
        CustomListbox={customListbox}
        onAutocompleteFocus={handleAutocompleteFocus}
        onAutocompleteBlur={handleAutocompleteBlur}
        isLocalLoading={isLocalLoading}
        isSearching={isSearching}
        relatedResultsLoading={relatedResultsLoading}
      />
      <AIThoughtsPanel 
        isLoading={isLoading}
        thoughts={thoughts}
        aiSearch={aiSearch}
      />
    </div>
  );
};

export default EnhancedSearchBox;
