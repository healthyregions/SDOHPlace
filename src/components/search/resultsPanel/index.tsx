"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { clearMapPreview, setShowFilter } from "@/store/slices/uiSlice";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { Box, SvgIcon, CircularProgress, Fade, Collapse } from "@mui/material";
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
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const uniqueRelatedList = React.useMemo(() => {
    const uniqueResults = searchState.relatedResults.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    return uniqueResults.filter(
      (v) => !searchState.results.some((t) => t.id === v.id)
    );
  }, [searchState.relatedResults, searchState.results]);
  const showRelatedSection = React.useMemo(() => {
    return (
      isQuery && !isLoading && !isResetting && uniqueRelatedList.length > 0
    );
  }, [isQuery, isLoading, isResetting, uniqueRelatedList.length]);

  const handleFilterToggle = () => {
    dispatch(setShowFilter(!showFilter));
  };
  const handleClearFilters = async () => {
    dispatch(clearMapPreview());
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
    const params = new URLSearchParams(window.location.search);
    const hasSearchParams = params.has("query") || params.has("ai_search");
    // leave time for ai_search to be set
    if (hasSearchParams) {
      setIsInitialLoad(true);
    }
    if (!isLoading) {
      setIsInitialLoad(false);
      setPreviousCount(searchState.results.length);
    }
  }, [isLoading, searchState.results.length, isResetting]);

  const renderLoadingState = () => (
    <Box className="flex flex-col w-full">
      <Box className="flex justify-center items-center h-64">
        <span className="mr-4">
          {displayCount > 0
            ? "Updating results..."
            : isInitialLoad
            ? "Searching for data you may be interested in..."
            : "Looking for data you may be interested in..."}
        </span>
        <CircularProgress
          size={24}
          className="text-strongorange ml-2"
          sx={{ animationDuration: "550ms" }}
        />
      </Box>
    </Box>
  );

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

        <Collapse
          className={"relative w-full"}
          in={showFilter}
          timeout={300}
          easing={"linear"}
        >
          <FilterPanel />
        </Collapse>

        <div className="flex flex-col" style={{ height: "100%" }}>
          <Fade in={true} timeout={300}>
            <div>
              {isLoading || isResetting || isInitialLoad ? (
                renderLoadingState()
              ) : (
                <div>
                  {searchState.results.length > 0 ? (
                    <Box
                      height="100%"
                      sx={{
                        overflowY: "scroll",
                        paddingRight: "1.25em",
                        marginTop: "1.5em",
                        maxHeight:
                          (isQuery && uniqueRelatedList.length > 0) ||
                          showFilter
                            ? SearchUIConfig.search.searchResults
                                .resultListHeight
                            : "100vh",
                      }}
                    >
                      {searchState.results.map((result) => (
                        <div key={result.id} className="mb-[0.75em]">
                          <ResultCard resultItem={result} />
                        </div>
                      ))}
                    </Box>
                  ) : (
                    !isInitialLoad && (
                      <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
                        <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                          <SearchIcon className="text-strongorange mb-[0.15em]" />
                          <div className="text-s">No results</div>
                        </Box>
                        <Box className="mb-[0.75em]">
                          <div className="text-s">
                            Search for themes instead?
                          </div>
                        </Box>
                        <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
                          <ThemeIcons variant="alternate" />
                        </Box>
                      </div>
                    )
                  )}

                  {showRelatedSection && (
                    <Box className="sm:my-[1.68em]">
                      <div className="sm:mb-[1.5em] sm:flex-col">
                        <div className="flex flex-grow sm:ml-[0.7em] items-center text-2xl">
                          <span className="mr-4">
                            You may be interested in...
                          </span>
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
                              SearchUIConfig.search.searchResults
                                .relatedListHeight,
                          }}
                        >
                          {uniqueRelatedList.map((result) => (
                            <div key={result.id} className="mb-[0.75em]">
                              <ResultCard resultItem={result} />
                            </div>
                          ))}
                        </Box>
                      </div>
                    </Box>
                  )}
                </div>
              )}
            </div>
          </Fade>
        </div>
      </span>
    </div>
  );
};

export default ResultsPanel;
