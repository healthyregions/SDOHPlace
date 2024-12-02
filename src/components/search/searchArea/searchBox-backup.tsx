import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
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
  setQuery,
  resetQuerySearch,
  fetchSearchResults,
  fetchSuggestions,
} from "@/store/slices/searchSlice";
import { setInputValue } from "@/store/slices/searchSlice";
import { setShowInfoPanel, setShowClearButton } from "@/store/slices/uiSlice";
import { useUrlParams } from "@/hooks/useUrlParams";
import { set } from "date-fns";

interface Props {
  schema: any;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  searchBox: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    // remove the button border and 'x' sign in the input field and other default hover settings
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
  },
  paper: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    fontColor: `${fullConfig.theme.colors["smokegray"]}`,
    fontSize: "0.875em",
    marginTop: "0.1em",
    width: "80%",
    transform: "translateX(5%)",
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

const SearchBox = ({ schema }: Props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const { showClearButton } = useSelector((state: RootState) => state.ui);
  const { query, inputValue, suggestions, filterQueries } = useSelector(
    (state: RootState) => state.search
  );
  const { setters } = useUrlParams();

  React.useEffect(() => {
    if (query) {
      setInputValue(query);
    }
  }, [query]);

  const handleSearch = (searchValue: string) => {
    const newQuery = searchValue || "*";
    setters.setUrlQuery(newQuery); 
    dispatch(
      fetchSearchResults({
        query: newQuery,
        filterQueries,
        schema,
      })
    );
  };
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue) {
      setters.setUrlQuery(inputValue);
      dispatch(
        fetchSearchResults({
          query: inputValue,
          filterQueries,
          schema,
        })
      );
    }
  };
  const handleDropdownSelect = (event: any, value: string | null) => {
    if (value) {
      setters.setUrlQuery(value);
      dispatch(setQuery(value));
      dispatch(
        fetchSearchResults({
          query: value,
          filterQueries,
          schema,
        })
      );
    }
  };
  const handleUserInputChange = async (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    dispatch(setInputValue(newInputValue));
    dispatch(setShowClearButton(!!newInputValue));
    if (newInputValue !== "") {
      dispatch(
        fetchSuggestions({
          inputValue: newInputValue,
          schema,
        })
      );
    } else {
      setters.setUrlQuery(null);
      dispatch(resetQuerySearch());
      dispatch(setShowClearButton(false));
      dispatch(
        fetchSearchResults({
          query: "*",
          filterQueries,
          schema,
        })
      );
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

  const handleClear = () => {
    setters.setUrlQuery(null);
    dispatch(resetQuerySearch());
    dispatch(setShowClearButton(false));
    dispatch(
      fetchSearchResults({
        query: "*",
        filterQueries,
        schema,
      })
    );
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
  return (
    <div className="sm:mt-6">
      <form id="search-form" onSubmit={handleSubmit}>
        <Autocomplete
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          freeSolo
          options={suggestions}
          value={query === "*" ? "" : query}
          inputValue={inputValue}
          onInputChange={handleUserInputChange}
          onChange={handleDropdownSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={textFieldRef}
              variant="outlined"
              fullWidth
              placeholder="Search"
              className={`${classes.searchBox} bg-white`}
              sx={
                {
                  // ... your existing styles
                }
              }
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-2xl mr-2 ml-2 text-frenchviolet" />
                    <Box component="span" className="mx-2">
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
                        <ArrowCircleRightIcon className="text-2xl" />
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
    </div>
  );
};
export default SearchBox;
