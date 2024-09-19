import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { SearchObject } from "../interface/SearchObject";
import SolrQueryBuilder from "../helper/SolrQueryBuilder";
import SuggestedResult from "../helper/SuggestedResultBuilder";
import { useEffect } from "react";
import { GetAllParams, reGetFilterQueries } from "../helper/ParameterList";

interface Props {
  schema: any;
  autocompleteKey: number;
  options: any[];
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  handleInputReset: () => void;
  processResults: (results, value) => [];
  inputRef: React.RefObject<HTMLInputElement>;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (params, value, filterQueries) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
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

const SearchBox = (props: Props): JSX.Element => {
  const [showClearButton, setShowClearButton] = React.useState(
    props.value ? true : false
  );
  const classes = useStyles();
  const urlParams = GetAllParams();
  const [userInput, setUserInput] = React.useState(
    props.value === "*" ? "" : props.value || ""
  );
  const [queryData, setQueryData] = React.useState<SearchObject>({
    userInput: "",
  });
  let searchQueryBuilder = new SolrQueryBuilder();
  searchQueryBuilder.setSchema(props.schema);

  let suggestResultBuilder = new SuggestedResult();
  const handleSubmit = (event) => {
    const filterQueries = reGetFilterQueries(urlParams);
    event.preventDefault();
    props.setQuery(userInput);
    props.setInputValue(userInput);
    urlParams.setSubject(null);
    props.handleSearch(urlParams, userInput, filterQueries);
  };
  const handleDropdownSelect = (event, value) => {
    const filterQueries = reGetFilterQueries(urlParams);
    props.setInputValue(value);
    props.setQuery(value);
    props.handleSearch(urlParams, value, filterQueries);
  };
  const handleUserInputChange = async (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setUserInput(newInputValue);
    props.setInputValue(newInputValue);
    setQueryData({
      ...queryData,
      userInput: newInputValue,
    });
    if (newInputValue !== "") {
      searchQueryBuilder.suggestQuery(newInputValue);
      searchQueryBuilder
        .fetchResult()
        .then((result) => {
          let returnedTerms = props.processResults(result, newInputValue);
          props.setOptions(returnedTerms);
        })
        .catch((error) => {
          console.error("Error fetching result:", error);
        });
    } else {
      props.handleInputReset();
    }
  };
  useEffect(() => {
    if (!urlParams.query) {
      setUserInput("");
    } else if (urlParams.query !== userInput) {
      setUserInput(urlParams.query === "*" ? "" : urlParams.query);
    } else {
      setUserInput(urlParams.query);
    }
  }, [urlParams.query]);
  return (
    <div className={`sm:mt-6 sm:ml-[3em] sm:mr-[2em]`}>
      <form id="search-form" onSubmit={handleSubmit}>
        <Autocomplete
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          key={props.autocompleteKey}
          freeSolo
          options={props.options}
          value={props.value ? props.value : ""}
          inputValue={userInput}
          onInputChange={(event, value, reason) => {
            if (event && event.type === "change") {
              handleUserInputChange(event, value);
              setShowClearButton(value !== "");
            }
          }}
          onChange={(event, value) => {
            handleDropdownSelect(event, value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={props.inputRef}
              variant="outlined"
              fullWidth
              placeholder="Search"
              className={`${classes.searchBox} bg-white`}
              sx={{
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
                    <SearchIcon className="text-2xl mr-2 ml-10 text-frenchviolet" />
                    <Box component="span" className="mx-2">
                      <a
                        href="#" // This needs to be updated after decide the advanced search page
                        className={`no-underline text-frenchviolet `}
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
                        <IconButton
                          onClick={() => {
                            setUserInput("");
                            urlParams.setSubject(null);
                            props.handleInputReset();
                            setShowClearButton(false);
                          }}
                        >
                          <CloseIcon className="text-2xl text-frenchviolet" />
                        </IconButton>
                      </InputAdornment>
                    )}
                    <InputAdornment position="end">
                      <Button
                        className=""
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
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
                        <ArrowCircleRightIcon className="text-2xl mr-10" />
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
