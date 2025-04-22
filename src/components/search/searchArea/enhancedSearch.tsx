import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { AppDispatch, RootState } from "@/store";
import {
  fetchSearchAndRelatedResults,
  setQuery,
  fetchSuggestions,
  setInputValue,
  setThoughts,
  setAISearch,
  clearSearch,
  setUsedSpellCheck,
  setIsSearching,
} from "@/store/slices/searchSlice";
import {
  setInfoPanelTab,
  setShowInfoPanel,
  setShowClearButton,
  setShowDetailPanel,
  clearMapPreview,
} from "@/store/slices/uiSlice";
import SpellCheckMessage from "./spellCheckMessage";
import { usePlausible } from "next-plausible";
import { EventType } from "@/lib/event";
import { Tooltip } from "@mui/material";

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

const CustomPopper = (props) => {
  const classes = useStyles();
  return (
    <Popper {...props} className={classes.popper} placement="bottom-start" />
  );
};

const CustomPaper = (props) => {
  const classes = useStyles();
  return <Paper {...props} className={classes.paper} />;
};

const EnhancedSearchBox = ({ schema }: Props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const classes = useStyles();
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<HTMLDivElement>(null);
  const [isLocalLoading, setIsLocalLoading] = React.useState(false);
  const [isMouseInDropdown, setIsMouseInDropdown] = React.useState(false);
  const [shouldShowDropdown, setShouldShowDropdown] = React.useState(false);
  const [hasSelectedItem, setHasSelectedItem] = React.useState(false);
  const { showClearButton } = useSelector((state: RootState) => state.ui);
  const maxLength = 100;
  const {
    aiSearch,
    query,
    inputValue,
    suggestions,
    filterQueries,
    sort,
    thoughts,
    isSearching,
  } = useSelector((state: RootState) => state.search);

  const [previousInput, setPreviousInput] = React.useState("");

  const clearSuggestions = React.useCallback(() => {
    dispatch({ type: "search/fetchSuggestions/fulfilled", payload: [] });
  }, [dispatch]);

  const debouncedFetchSuggestions = React.useCallback(
    debounce((value: string, schema: any, prevValue: string) => {
      if (isSearching || isLocalLoading) {
        return;
      }

      const isDifferentInput =
        !prevValue.includes(value) && !value.includes(prevValue);
      if (isDifferentInput) {
        clearSuggestions();
      }
      if (value && value.length >= 2 && !aiSearch) {
        dispatch(fetchSuggestions({ inputValue: value, schema }));
      } else {
        clearSuggestions();
        setShouldShowDropdown(false);
      }
    }, 300),
    [dispatch, aiSearch, clearSuggestions, isSearching, isLocalLoading]
  );

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

  const handleInputReset = () => {
    if (hasSelectedItem) {
      setHasSelectedItem(false);
    }
  };

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

  const performSearch = React.useCallback(
    async (searchValue: string | null) => {
      if (!searchValue) return;
      if (searchValue === query && !isLocalLoading && !isSearching) return;
      setShouldShowDropdown(false);
      clearSuggestions();
      dispatch(clearMapPreview());
      dispatch(setQuery(searchValue));
      dispatch(setShowDetailPanel(null));
      dispatch(setIsSearching(true));
      setIsLocalLoading(true);
      dispatch(setThoughts(""));
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
              searchEvent:
                searchEventType +
                ": " +
                searchValue +
                " & " +
                filterQueries.join(" "),
            },
          });
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLocalLoading(false);
        dispatch(setIsSearching(false));
        setShouldShowDropdown(false);
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
      query,
      isLocalLoading,
      isSearching,
    ]
  );

  // Avoid multiple requests
  const debouncedPerformSearch = React.useCallback(
    debounce((searchValue: string | null) => {
      performSearch(searchValue);
    }, 10),
    [performSearch]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setShouldShowDropdown(false);

    if (isLoading) return;

    setIsLocalLoading(true);
    dispatch(setIsSearching(true));

    const originalValue = inputValue;

    debouncedPerformSearch(originalValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      setShouldShowDropdown(false);

      if (isLocalLoading || isSearching) return;
      const currentInputValue = inputValue;
      if (!isMouseInDropdown) {
        dispatch(setInputValue(currentInputValue));
        debouncedPerformSearch(currentInputValue);
      } else {
        debouncedPerformSearch(inputValue);
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

        const prevInput = inputValue;
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

  const isBrowser = typeof window !== "undefined";

  const isSearchBlocked = React.useMemo(() => {
    return (isLocalLoading || isSearching) && aiSearch;
  }, [isLocalLoading, isSearching, aiSearch]);

  const noSearchAllowed = React.useMemo(() => {
    return (
      aiSearch &&
      (!inputValue ||
        inputValue.length > maxLength ||
        inputValue.length === 0 ||
        inputValue === "*")
    );
  }, [aiSearch, inputValue, maxLength]);

  const handleClear = () => {
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

  const handleModeSwitch = () => {
    if (isSearchBlocked) {
      return;
    }
    const newValue = !aiSearch;
    dispatch(setAISearch(newValue));
    dispatch(setThoughts(""));
    setInputValue("");
    dispatch(setUsedSpellCheck(false));
    plausible(EventType.ChangedSearchMode, {
      props: {
        aiSearch: !!newValue,
      },
    });
  };

  const isIOS = React.useMemo(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      return (
        /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
        !(window as any).MSStream
      );
    }
    return false;
  }, []);

  const isLoading = isLocalLoading || isSearching;

  const CustomListbox = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
  >((props, ref) => {
    return (
      <ul
        ref={ref}
        {...props}
        onMouseEnter={() => setIsMouseInDropdown(true)}
        onMouseLeave={() => {
          setIsMouseInDropdown(false);
        }}
        className={`${props.className || ""} custom-autocomplete-listbox`}
      />
    );
  });
  CustomListbox.displayName = "CustomListbox";

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
      <form id="search-form" onSubmit={handleSubmit}>
        <Autocomplete
          ref={autocompleteRef}
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          freeSolo
          open={shouldShowDropdown && !aiSearch}
          options={aiSearch ? [] : suggestions}
          value={query === "*" ? "" : query}
          inputValue={inputValue === "*" ? "" : inputValue}
          onInputChange={handleUserInputChange}
          onChange={handleDropdownSelect}
          filterOptions={(options) => options}
          autoSelect={false}
          disablePortal={false}
          disableListWrap={true}
          selectOnFocus={false}
          blurOnSelect="touch"
          includeInputInList={true}
          openOnFocus={false}
          disableCloseOnSelect={false}
          ListboxComponent={CustomListbox}
          clearOnBlur={false}
          clearOnEscape={false}
          forcePopupIcon={false}
          handleHomeEndKeys={false}
          onKeyDown={handleKeyDown}
          onFocus={handleAutocompleteFocus}
          onBlur={handleAutocompleteBlur}
          renderOption={(props, option) => {
            const { "aria-selected": _, onClick, ...otherProps } = props;
            return (
              <li
                {...otherProps}
                onClick={(e) => {
                  setHasSelectedItem(true);
                  setShouldShowDropdown(false);
                  clearSuggestions();

                  if (!isLocalLoading && !isSearching) {
                    setIsLocalLoading(true);
                    dispatch(setIsSearching(true));
                  }

                  if (onClick) onClick(e);
                }}
                className={`${props.className} hover:bg-[#f0f0f0] cursor-pointer`}
                key={option}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <span className="px-1">{option}</span>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={textFieldRef}
              variant="outlined"
              fullWidth
              placeholder={
                aiSearch
                  ? `Ask a research question (max ${maxLength} characters)...`
                  : "Type keyword..."
              }
              className={`${classes.searchBox} bg-white`}
              inputProps={{ maxLength: maxLength, ...params.inputProps }}
              sx={{
                paddingRight: "0",
                borderRadius: "1.75em",
                border: `1px solid ${fullConfig.theme.colors["frenchviolet"]}`,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "1.75em",
                  color: fullConfig.theme.colors["smokegray"],
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  transition: "all 0.2s ease-in-out",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip
                      title={
                        isSearchBlocked
                          ? "Please wait for the current search to complete"
                          : !aiSearch
                          ? "Currently using keyword search"
                          : "Switch to keyword search"
                      }
                    >
                      <IconButton
                        sx={{
                          mr: "m",
                          cursor: isSearchBlocked ? "not-allowed" : "pointer",
                          opacity: isSearchBlocked ? 0.5 : 1,
                          color: fullConfig.theme.colors["frenchviolet"],
                        }}
                        onClick={handleModeSwitch}
                        className={`${classes.aiModeButton} ${
                          !aiSearch ? "active" : ""
                        }`}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Box component="span" className="mx-2">
                      <Tooltip
                        title={
                          isSearchBlocked
                            ? "Please wait for the current search to complete"
                            : aiSearch
                            ? "Currently using AI-Inspired search"
                            : "Switch to AI-Inspired search"
                        }
                      >
                        <IconButton
                          sx={{
                            mr: ".2em",
                            cursor: isSearchBlocked ? "not-allowed" : "pointer",
                            opacity: isSearchBlocked ? 0.5 : 1,
                            color: fullConfig.theme.colors["frenchviolet"],
                          }}
                          onClick={handleModeSwitch}
                          className={`${classes.aiModeButton} ${
                            aiSearch ? "active" : ""
                          }`}
                        >
                          <QuestionAnswerIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          aiSearch
                            ? "Learn more about AI-Inspired search"
                            : "Learn more about keyword search"
                        }
                      >
                        <IconButton
                          sx={{
                            color: fullConfig.theme.colors["frenchviolet"],
                          }}
                          className={`${classes.aiModeButton} font-black`}
                          onClick={() => {
                            dispatch(setShowInfoPanel(true));
                            dispatch(setInfoPanelTab(aiSearch ? 2 : 1));
                          }}
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <Box display="flex" alignItems="center">
                    {showClearButton && (
                      <InputAdornment position="end">
                        <Tooltip
                          title={
                            isSearchBlocked
                              ? "Please wait for the current search to complete"
                              : "Clear search"
                          }
                        >
                          <span>
                            <IconButton
                              onClick={handleClear}
                              disabled={isSearchBlocked}
                              sx={{
                                opacity: isSearchBlocked ? 0.5 : 1,
                                cursor: isSearchBlocked
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              <CloseIcon className="text-2xl text-frenchviolet" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    )}
                    <InputAdornment position="end">
                      <Tooltip
                        title={
                          isLoading || noSearchAllowed
                            ? aiSearch &&
                              (!inputValue ||
                                inputValue === "*" ||
                                inputValue.length > maxLength)
                              ? !inputValue
                                ? "Please enter your question first"
                                : inputValue.length > maxLength
                                ? `Question must be within ${maxLength} characters`
                                : "Please enter a valid question"
                              : ""
                            : ""
                        }
                        enterDelay={0}
                        leaveDelay={200}
                      >
                        <span style={{ display: "inline-flex" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading || noSearchAllowed}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              backgroundColor: "transparent",
                              color: fullConfig.theme.colors["frenchviolet"],
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                              "&:disabled": {
                                color: fullConfig.theme.colors["frenchviolet"],
                                opacity: noSearchAllowed ? 0.1 : 1.0,
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            {isLoading ? (
                              <span>
                                <CircularProgress
                                  className={`text-l ${classes.loadingButton}`}
                                />
                              </span>
                            ) : (
                              <ArrowCircleRightIcon className="text-xxl" />
                            )}
                          </Button>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  </Box>
                ),
                type: "search",
              }}
            />
          )}
        />
      </form>
      {thoughts && aiSearch && (
        <div className="w-full bg-gray-50 rounded-lg border border-frenchviolet/20 mt-2">
          <div className="p-4">
            <h3 className="text-md text-frenchviolet mb-2">
              Inspired by your search:
            </h3>
            <p className="text-sm text-gray-600 break-words">
              <span dangerouslySetInnerHTML={{ __html: thoughts }} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBox;
