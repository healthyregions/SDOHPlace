import * as React from "react";
import { useDispatch } from "react-redux";
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
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { AppDispatch } from "@/store";
import {
  setInfoPanelTab,
  setShowInfoPanel,
} from "@/store/slices/uiSlice";
import { CustomPaper, CustomPopper, useSearchStyles } from "./searchUiComponents";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { MAX_SEARCH_LENGTH, isSearchAllowed, isSearchBlocked } from "./searchUtils";

const fullConfig = resolveConfig(tailwindConfig);

interface SearchInputProps {
  textFieldRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  aiSearch: boolean;
  query: string;
  suggestions: string[];
  isLoading: boolean;
  showClearButton: boolean;
  onUserInputChange: (event: React.ChangeEvent<{}>, value: string) => void;
  onDropdownSelect: (event: any, value: string | null) => void;
  onSubmit: (event: React.FormEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  handleClear: () => void;
  handleModeSwitch: () => void;
  shouldShowDropdown: boolean;
  autocompleteRef: React.RefObject<HTMLDivElement>;
  CustomListbox: any;
  onAutocompleteFocus: (event: React.FocusEvent) => void;
  onAutocompleteBlur: (event: React.FocusEvent) => void;
  isLocalLoading: boolean;
  isSearching: boolean;
  relatedResultsLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  textFieldRef,
  inputValue,
  aiSearch,
  query,
  suggestions,
  isLoading,
  showClearButton,
  onUserInputChange,
  onDropdownSelect,
  onSubmit,
  onKeyDown,
  handleClear,
  handleModeSwitch,
  shouldShowDropdown,
  autocompleteRef,
  CustomListbox,
  onAutocompleteFocus,
  onAutocompleteBlur,
  isLocalLoading,
  isSearching,
  relatedResultsLoading,
}) => {
  const classes = useSearchStyles();
  const dispatch = useDispatch<AppDispatch>();
  const maxLength = MAX_SEARCH_LENGTH;
  
  const searchBlocked = isSearchBlocked(
    isLocalLoading,
    isSearching,
    relatedResultsLoading,
    aiSearch
  );
  
  const noSearchAllowed = !isSearchAllowed(aiSearch, inputValue, maxLength);

  return (
    <form id="search-form" onSubmit={onSubmit}>
      <Autocomplete
        ref={autocompleteRef}
        PopperComponent={CustomPopper}
        PaperComponent={CustomPaper}
        freeSolo
        open={shouldShowDropdown && !aiSearch}
        options={aiSearch ? [] : suggestions}
        value={query === "*" ? "" : query}
        inputValue={inputValue === "*" ? "" : inputValue}
        onInputChange={onUserInputChange}
        onChange={onDropdownSelect}
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
        onKeyDown={onKeyDown}
        onFocus={onAutocompleteFocus}
        onBlur={onAutocompleteBlur}
        renderOption={(props, option) => {
          const { "aria-selected": _, onClick, ...otherProps } = props;
          return (
            <li
              {...otherProps}
              onClick={(e) => {
                if (onClick) onClick(e);
              }}
              className={`${props.className} hover:bg-[#f0f0f0] cursor-pointer`}
              key={option}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
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
                      searchBlocked
                        ? "Please wait for the current search to complete"
                        : !aiSearch
                        ? "Currently using keyword search"
                        : "Switch to keyword search"
                    }
                  >
                    <IconButton
                      sx={{
                        mr: "m",
                        cursor: searchBlocked ? "not-allowed" : "pointer",
                        opacity: searchBlocked ? 0.5 : 1,
                        color: fullConfig.theme.colors["frenchviolet"],
                      }}
                      onClick={handleModeSwitch}
                      className={`${classes.aiModeButton} ${!aiSearch ? "active" : ""}`}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Box component="span" className="mx-2">
                    <Tooltip
                      title={
                        searchBlocked
                          ? "Please wait for the current search to complete"
                          : aiSearch
                          ? "Currently using AI-Inspired search"
                          : "Switch to AI-Inspired search"
                      }
                    >
                      <IconButton
                        sx={{
                          mr: ".2em",
                          cursor: searchBlocked ? "not-allowed" : "pointer",
                          opacity: searchBlocked ? 0.5 : 1,
                          color: fullConfig.theme.colors["frenchviolet"],
                        }}
                        onClick={handleModeSwitch}
                        className={`${classes.aiModeButton} ${aiSearch ? "active" : ""}`}
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
                          searchBlocked
                            ? "Please wait for the current search to complete"
                            : "Clear search"
                        }
                      >
                        <span>
                          <IconButton
                            onClick={handleClear}
                            disabled={searchBlocked}
                            sx={{
                              opacity: searchBlocked ? 0.5 : 1,
                              cursor: searchBlocked ? "not-allowed" : "pointer",
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
                              <CircularProgress className={`text-l ${classes.loadingButton}`} />
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
  );
};

export default SearchInput; 