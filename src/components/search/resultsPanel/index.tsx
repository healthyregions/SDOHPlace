"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { setShowFilter } from "@/store/slices/uiSlice";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { Box, SvgIcon, CircularProgress, Fade } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import React from "react";
import ResultCard from "./resultCard";
import FilterPanel from "../filterPanel";
import {
  selectSearchState,
  getFilterStatus,
  resetFilters,
} from "@/middleware/filterHelper";
import ThemeIcons from "../helper/themeIcons";

interface Props {
  schema: any;
  setHighlightLyr: (value: string) => void;
  setHighlightIds: (value: string[]) => void;
}

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  resultsPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
  },
}));

const ResultsPanel = (props: Props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const searchState = useSelector(selectSearchState);
  const filterStatus = useSelector(getFilterStatus);
  const showFilter = useSelector((state: RootState) => state.ui.showFilter);
  const isLoading = searchState.isSearching || searchState.isSuggesting;
  const isQuery = searchState.query !== "*" && searchState.query !== "";
  const [previousCount, setPreviousCount] = React.useState(
    searchState.results.length
  );
  const [isResetting, setIsResetting] = React.useState(false);

  const uniqueRelatedList = React.useMemo(() => {
    return searchState.relatedResults
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      .filter((v) => searchState.results.every((t) => t.id !== v.id));
  }, [searchState.relatedResults, searchState.results]);
  const handleFilterToggle = () => {
    dispatch(setShowFilter(!showFilter));
  };
  const handleClearFilters = async () => {
    setIsResetting(true);
    await resetFilters(store);
    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };
  const displayCount = React.useMemo(() => {
    if (isResetting) return previousCount;
    if (isLoading) return previousCount;
    return searchState.results.length;
  }, [isLoading, isResetting, previousCount, searchState.results.length]);
  React.useEffect(() => {
    if (!isLoading && !isResetting) {
      setPreviousCount(searchState.results.length);
    }
  }, [isLoading, searchState.results.length, isResetting]);
  return (
    <div
      className="results-panel"
      style={{ flex: "1 1 auto", overflow: "hidden" }}
    >
      <span className={classes.resultsPanel}>
        <Box>
          <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center">
            <div className="flex flex-col sm:flex-row flex-grow text-2xl">
              <Fade in={!isResetting} timeout={300}>
                <div>
                  {displayCount > 0 && (
                    <Box>
                      {isQuery
                        ? `Results (${displayCount})`
                        : `All Data Sources (${displayCount})`}
                    </Box>
                  )}
                </div>
              </Fade>
            </div>
            {filterStatus.hasActiveFilters && !isLoading && !isResetting && (
              <div className="flex flex-col sm:flex-row items-enter justify-center mr-4 cursor-pointer text-uppercase">
                <div className="text-frenchviolet" onClick={handleClearFilters}>
                  Clear All
                </div>
              </div>
            )}

            <div
              className="flex sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em] text-frenchviolet cursor-pointer"
              onClick={handleFilterToggle}
            >
              <SvgIcon
                component={FilterAltIcon}
                className="text-frenchviolet mr-1"
              />
              <div>Sort & Filter</div>
            </div>
          </div>
        </Box>

        {showFilter && <FilterPanel />}

        <Box
          height="100%"
          sx={{
            overflowY: "scroll",
            paddingRight: "1.25em",
            marginTop: "1.5em",
            maxHeight:
              (isQuery && uniqueRelatedList.length > 0) || showFilter
                ? SearchUIConfig.search.searchResults.resultListHeight
                : "100vh",
          }}
        >
          {isLoading || isResetting ? (
            <Box className="flex justify-center items-center h-64">
              <span className="mr-4">
                {displayCount > 0
                  ? "Updating results..."
                  : "Looking for data you may be interested in..."}
              </span>
              <CircularProgress
                size={24}
                className="text-strongorange ml-2"
                sx={{ animationDuration: "550ms" }}
              />
            </Box>
          ) : (
            <Fade in={true} timeout={300}>
              <div>
                {searchState.results.length > 0 ? (
                  <div>
                    {searchState.results.map((result) => (
                      <div key={result.id} className="mb-[0.75em]">
                        <ResultCard
                          resultItem={result}
                          setHighlightIds={props.setHighlightIds}
                          setHighlightLyr={props.setHighlightLyr}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
                    <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                      <SearchIcon className="text-strongorange mb-[0.15em]" />
                      <div className="text-s">No results</div>
                    </Box>
                    <Box className="mb-[0.75em]">
                      <div className="text-s">Search for themes instead?</div>
                    </Box>
                    <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
                      <ThemeIcons variant="alternate" />
                    </Box>
                  </div>
                )}
              </div>
            </Fade>
          )}
        </Box>

        {!isLoading && uniqueRelatedList.length > 0 && isQuery && (
          <Box className="sm:my-[1.68em]">
            <div className="sm:mb-[1.5em] sm:flex-col">
              <div className="flex flex-grow sm:ml-[0.7em] items-center text-2xl">
                <span className="mr-4">You may be interested in...</span>
                <div
                  className="flex-grow border-b-2 sm:mr-[2.3em]"
                  style={{
                    height: "1px",
                    border: `1px solid ${fullConfig.theme.colors["strongorange"]}`,
                  }}
                />
              </div>
              <Box
                height="100%"
                className="sm:mt-[0.875em]"
                sx={{
                  overflowY: "scroll",
                  paddingRight: "1em",
                  maxHeight:
                    SearchUIConfig.search.searchResults.relatedListHeight,
                }}
              >
                {uniqueRelatedList.map((result) => (
                  <div key={result.id} className="mb-[0.75em]">
                    <ResultCard
                      resultItem={result}
                      setHighlightIds={props.setHighlightIds}
                      setHighlightLyr={props.setHighlightLyr}
                    />
                  </div>
                ))}
              </Box>
            </div>
          </Box>
        )}
      </span>
    </div>
  );
};

export default ResultsPanel;
