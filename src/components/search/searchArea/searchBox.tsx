import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import { SearchObject } from "../interface/SearchObject";
import SolrQueryBuilder from "../helper/SolrQueryBuilder";
import SuggestedResult from "../helper/SuggestedResultBuilder";
import { useEffect } from "react";
import { get } from "http";
import { GetAllParams, reGetFilterQueries } from "../helper/ParameterList";

interface Props {
  schema: any;
  autocompleteKey: number;
  options: any[];
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  handleInputReset: () => void;
  processResults: (results, value) => void;
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
  const classes = useStyles();
  const params = GetAllParams();
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
    const filterQueries = reGetFilterQueries(params);
    event.preventDefault();
    props.setQuery(userInput);
    props.setInputValue(userInput);
    props.handleSearch(params, userInput, filterQueries);
  };
  const handleDropdownSelect = (event, value) => {
    const filterQueries = reGetFilterQueries(params);
    props.setInputValue(value);
    props.setQuery(props.inputValue);
    props.handleSearch(params, props.inputValue, filterQueries);
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
          props.processResults(result, newInputValue);
          props.setOptions(suggestResultBuilder.getTerms());
        })
        .catch((error) => {
          console.error("Error fetching result:", error);
        });
    } else {
      // setUserInput("");
      // props.setInputValue("");
      // props.inputRef.current?.focus();
      // props.inputRef.current?.select();
      props.handleInputReset();
    }
  };
  useEffect(() => {
    if (props.value !== "" && props.value !== userInput) {
      setUserInput(props.value || "");
    }
  }, [props.value]);
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
                  <InputAdornment position="start" className="mr-2">
                    <SearchIcon className="text-2xl" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Box display="flex" alignItems="center">
                    <Box component="span" className="mr-2">
                      <a
                        href="#" // This needs to be updated after decide the advanced search page
                        className={`text-frenchviolet no-underline ${classes.searchBox}`}
                      >
                        Help
                      </a>
                    </Box>
                    <InputAdornment position="end">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          minWidth: "auto",
                          padding: 0,
                          borderRadius: "50%",
                          width: "2.25em",
                          height: "2.25em",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            fullConfig.theme.colors["frenchviolet"],
                        }}
                      >
                        <ArrowForwardIcon />
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
