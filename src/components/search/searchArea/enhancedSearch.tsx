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
  Tooltip
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
} from "@/store/slices/searchSlice";
import {
  setShowInfoPanel,
  setShowClearButton,
  setShowDetailPanel,
  clearMapPreview,
} from "@/store/slices/uiSlice";
import SpellCheckMessage from "./spellCheckMessage";

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
  const classes = useStyles();
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const [isLocalLoading, setIsLocalLoading] = React.useState(false);
  const { showClearButton } = useSelector((state: RootState) => state.ui);
  const {
    aiSearch,
    query,
    inputValue,
    suggestions,
    filterQueries,
    sortBy,
    sortOrder,
    thoughts,
    isSearching,
  } = useSelector((state: RootState) => state.search);
  React.useEffect(() => {
    if (query) {
      dispatch(setInputValue(query));
    }
  }, [query, dispatch]);
  const debouncedFetchSuggestions = React.useCallback(
    debounce((value: string, schema: any) => {
      if (value && !aiSearch) {
        dispatch(fetchSuggestions({ inputValue: value, schema }));
      }
    }, 300),
    [dispatch]
  );
  const performSearch = React.useCallback(
    async (searchValue: string | null) => {
      if (searchValue) {
        dispatch(clearMapPreview());
        dispatch(setQuery(searchValue));
        dispatch(setShowDetailPanel(null));
        setIsLocalLoading(true);
        dispatch(setThoughts(""));
        try {
          await dispatch(
              fetchSearchAndRelatedResults({
                query: searchValue,
                filterQueries,
                schema,
                sortBy,
                sortOrder,
                bypassSpellCheck: false,
              })
            );
        } finally {
          setIsLocalLoading(false);
        }
      }
    },
    [dispatch, aiSearch, schema, filterQueries, sortBy, sortOrder]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    performSearch(inputValue);
  };

  const handleDropdownSelect = (event: any, value: string | null) => {
    if (value && value !== query) {
      performSearch(value);
    }
  };

  const handleUserInputChange = async (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    dispatch(setInputValue(newInputValue));
    dispatch(setShowClearButton(!!newInputValue));
    if (newInputValue !== "") {
      if (!aiSearch) {
        debouncedFetchSuggestions(newInputValue, schema);
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
  const handleClear = () => {
     dispatch(clearSearch());
    if (isBrowser) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('query');
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
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
  const maxLength = 50;
  return (
    <div className="sm:mt-6">
      <SpellCheckMessage />
      <form id="search-form" onSubmit={handleSubmit}>
        <Autocomplete
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          freeSolo
          options={aiSearch ? [] : suggestions}
          value={query === "*" ? "" : query}
          inputValue={inputValue === "*" ? "" : inputValue}
          onInputChange={handleUserInputChange}
          onChange={handleDropdownSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={textFieldRef}
              variant="outlined"
              fullWidth
              placeholder={aiSearch ? "Ask a question within 50 characters..." : "Type keyword..."}
              className={`${classes.searchBox} bg-white`}
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
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-2xl mr-2 ml-2 text-frenchviolet" />
                    <Box component="span" className="mx-2">
                      <Tooltip
                        title={
                          aiSearch
                            ? "Switch to keyword search"
                            : "Try AI-Inspired search"
                        }
                      >
                        <IconButton
                          sx={{ mr: "1em", cursor: "pointer" }}
                          onClick={() => {
                            dispatch(setAISearch(!aiSearch));
                            dispatch(setThoughts(""));
                            setInputValue("");
                          }}
                          className={`${classes.aiModeButton} ${
                            aiSearch ? "active" : ""
                          }`}
                        >
                          <QuestionAnswerIcon />
                        </IconButton>
                      </Tooltip>
                      <a
                        onClick={() => dispatch(setShowInfoPanel(true))}
                        style={{ cursor: "pointer" }}
                        className="no-underline text-frenchviolet"
                      >
                        <InfoOutlinedIcon />
                      </a>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <Box display="flex" alignItems="center">
                    {showClearButton && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClear}>
                          <CloseIcon className="text-2xl text-frenchviolet" />
                        </IconButton>
                      </InputAdornment>
                    )}
                    <InputAdornment position="end">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
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
                        }}
                      >
                        {isLoading ? (
                          <span>
                            <CircularProgress
                              size={24}
                              className={classes.loadingButton}
                            />
                          </span>
                        ) : (
                          <ArrowCircleRightIcon className="text-xxl" />
                        )}
                      </Button>
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-frenchviolet/20">
          <h3 className="text-md text-frenchviolet">Inspired by your search:</h3>
          <p className="text-sm text-gray-600">
            <span dangerouslySetInnerHTML={{ __html: thoughts }} />
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBox;
