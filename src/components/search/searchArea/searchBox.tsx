
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
import { setQuery, fetchSuggestions, setInputValue } from "@/store/slices/searchSlice";
import { setShowInfoPanel, setShowClearButton, setShowDetailPanel, setMapPreview } from "@/store/slices/uiSlice";
import SpellCheckMessage from "./spellCheckMessage";
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
  const { query, inputValue, suggestions } = useSelector(
    (state: RootState) => state.search
  );

  React.useEffect(() => {
    if (query) {
      dispatch(setInputValue(query));
    }
  }, [query, dispatch]);
  const debouncedFetchSuggestions = React.useCallback(
    debounce((value: string, schema: any) => {
      if (value) {
        dispatch(
          fetchSuggestions({
            inputValue: value,
            schema,
          })
        );
      }
    }, 300),
    [dispatch]
  );
  const performSearch = React.useCallback(
    (searchValue: string | null) => {
      if (searchValue) {
        dispatch(setQuery(searchValue));
        dispatch(setShowDetailPanel(null));
      }
    },
    [dispatch]
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
      debouncedFetchSuggestions(newInputValue, schema);
    } else {
      dispatch(setQuery(null));
      dispatch(setShowClearButton(false));
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
    dispatch(setInputValue(""));
    dispatch(setQuery(null));
    dispatch(setShowDetailPanel(null));
    dispatch(setShowClearButton(false));
    dispatch(setMapPreview([]))
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
			<SpellCheckMessage />
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