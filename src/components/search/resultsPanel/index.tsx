"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { clearMapPreview, setShowFilter } from "@/store/slices/uiSlice";
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
import { EventType } from "@/lib/event";
import { usePlausible } from "next-plausible";
import { reloadAiSearchFromUrl } from "@/store/slices/searchSlice";

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
  const plausible = usePlausible();
  const showFilter = useSelector((state: RootState) => state.ui.showFilter);
  const isLoading = searchState.isSearching || searchState.isSuggesting;
  const isQuery =
    searchState.query && searchState.query !== "*" && searchState.query !== "";
  const [previousCount, setPreviousCount] = React.useState(
    searchState.results.length
  );
  const [isResetting, setIsResetting] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [hasTriedUrlReload, setHasTriedUrlReload] = React.useState(false);
  const [, forceUpdate] = React.useState({});
  const [hasSearchBeenInitiated, setHasSearchBeenInitiated] = React.useState(false);
  const [showNoResults, setShowNoResults] = React.useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = React.useState(false);

  React.useEffect(() => {
    if (!hasTriedUrlReload && !searchState.isSearching) {
      const params = new URLSearchParams(window.location.search);
      const hasAiSearch = params.has("ai_search") && params.get("ai_search") === "true";
      const query = params.get("query");    
      if (hasAiSearch && query && query.trim() !== "" && searchState.results.length === 0) {
        setHasTriedUrlReload(true);
        setTimeout(() => {
          dispatch(
            reloadAiSearchFromUrl({
              query: query,
              schema: props.schema,
            })
          );
        }, 300);
      } else {
        setHasTriedUrlReload(true);
      }
    }
  }, [dispatch, hasTriedUrlReload, searchState.isSearching, searchState.results.length, props.schema]);

  const uniqueRelatedList = React.useMemo(() => {
    try {
      const relatedResults = Array.isArray(searchState.relatedResults)
        ? searchState.relatedResults
        : [];

      const uniqueResults = relatedResults.filter(
        (v, i, a) => a.findIndex((t) => (t && t.id) === (v && v.id)) === i
      );

      const results = Array.isArray(searchState.results)
        ? searchState.results
        : [];

      const filtered = uniqueResults.filter(
        (v) => v && !results.some((t) => t && t.id === v.id)
      );

      return filtered.filter((item) => item && item.id);
    } catch (error) {
      console.error("Error processing related results:", error);
      return [];
    }
  }, [searchState.relatedResults, searchState.results]);

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
    if (isResetting || isLoading) {
      return previousCount;
    }

    const totalCount = searchState.results.length + uniqueRelatedList.length;
    return totalCount;
  }, [
    isLoading,
    isResetting,
    previousCount,
    searchState.results.length,
    uniqueRelatedList.length,
  ]);
  
  React.useEffect(() => {
    if (searchState.query && searchState.query !== "" && searchState.query !== "*") {
      const isForceRefresh = searchState.query.includes(":");
      if (isForceRefresh) {
        setHasCompletedSearch(false);
        setIsInitialLoad(true);
        forceUpdate({});
      }
      setHasSearchBeenInitiated(true);
    }
  }, [searchState.query]);
  
  React.useEffect(() => {
    if (isLoading) {
      setHasCompletedSearch(false);
      setShowNoResults(false);
      setIsInitialLoad(true);
    } else if (!isInitialLoad) {
      setHasCompletedSearch(true);
      if (hasSearchBeenInitiated && searchState.results.length === 0 && uniqueRelatedList.length === 0) {
        setTimeout(() => {
          setShowNoResults(true);
        }, 500);
      } else {
        setShowNoResults(true);
      }
    }
  }, [isLoading, isInitialLoad, hasSearchBeenInitiated, searchState.results.length, uniqueRelatedList.length]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasSearchParams = params.has("query") || params.has("ai_search");

    if (hasSearchParams) {
      setIsInitialLoad(true);
    }
    
    if (!isLoading) {
      if (searchState.results.length > 0 || searchState.relatedResults.length > 0 || hasCompletedSearch) {
        setIsInitialLoad(false);
      }
      const totalCount = searchState.results.length + uniqueRelatedList.length;
      setPreviousCount(totalCount);
    } else {
      setIsInitialLoad(true);
    }
  }, [
    isLoading,
    searchState.results.length,
    searchState.relatedResults.length, 
    uniqueRelatedList.length,
    isResetting,
    hasCompletedSearch
  ]);

  React.useEffect(() => {
    if (isLoading) {
      forceUpdate({});
      setIsInitialLoad(true);
      setShowNoResults(false);
      if (searchState.aiSearch) {
        setPreviousCount(0);
      }
    }
  }, [isLoading, searchState.aiSearch]);

  const renderLoadingState = () => {
    return (
      <Box className="flex flex-col w-full">
        <Box className="flex justify-center items-center h-64">
          <div className="text-center w-full px-4 py-3 rounded-lg bg-white">
            <span className="mr-4 text-lg transition-all duration-300 ease-in-out">
              {displayCount > 0
                ? "Updating results..."
                : isInitialLoad
                ? "Searching for data you may be interested in..."
                : "Looking for data you may be interested in..."}
            </span>
            <div className="mt-3">
              <CircularProgress
                size={24}
                className="text-strongorange ml-2"
                sx={{ animationDuration: "550ms" }}
              />
            </div>
          </div>
        </Box>
      </Box>
    );
  };

  const shouldShowResultsCount = React.useMemo(() => {
    return !isLoading && !isResetting && hasCompletedSearch && displayCount > 0;
  }, [isLoading, isResetting, hasCompletedSearch, displayCount]);

  const shouldShowLoading = isLoading || isResetting || isInitialLoad || !showNoResults;

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
                  {shouldShowResultsCount && (
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
          className={`relative w-full ${showFilter ? "mb-4" : ""}`}
          in={showFilter}
          timeout={300}
          easing={"linear"}
        >
          <FilterPanel />
        </Collapse>

        <div className="flex flex-col" style={{ height: "100%" }}>
          <Fade in={true} timeout={300}>
            <div>
              {shouldShowLoading ? (
                <div className="transition-opacity duration-500">
                  {renderLoadingState()}
                </div>
              ) : (
                <div className="force-scrollbar transition-opacity duration-500">
                  {searchState.results.length > 0 ||
                  uniqueRelatedList.length > 0 ||
                  displayCount > 0 ? (
                    <Box
                      height="100%"
                      sx={{
                        overflowY: "scroll",
                        paddingRight: "1.25em",
                        maxHeight: "100vh",
                      }}
                    >
                      {searchState.results &&
                        searchState.results.length > 0 && (
                          <>
                            {searchState.results.map((result) =>
                              result && result.id ? (
                                <div key={result.id} className="mb-[0.75em]">
                                  <ResultCard resultItem={result} />
                                </div>
                              ) : null
                            )}
                          </>
                        )}
                      {uniqueRelatedList && uniqueRelatedList.length > 0 && (
                        <>
                          {uniqueRelatedList.map((result) =>
                            result && result.id ? (
                              <div key={result.id} className="mb-[0.75em]">
                                <ResultCard resultItem={result} />
                              </div>
                            ) : null
                          )}
                        </>
                      )}
                    </Box>
                  ) : (
                    <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
                      <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                        <SearchIcon className="text-strongorange mb-[0.15em]" />
                        <div className="text-s">No results</div>
                        {(() => {
                          try {
                            if (process.env.NODE_ENV !== "development") {
                              plausible(EventType.ReceivedNoSearchResults, {
                                props: {
                                  searchQuery: searchState.query,
                                  searchFilter: filterStatus.activeFilters,
                                  fullSearchStates:
                                    searchState.query +
                                    " || " +
                                    Object.entries(filterStatus.activeFilters)
                                      .map(([key, value]) => `${key}: ${value}`)
                                      .join(" || "),
                                },
                              });
                            }
                            return null;
                          } catch (error) {
                            console.error("Analytics error:", error);
                            return null;
                          }
                        })()}
                      </Box>
                      <Box className="mb-[0.75em]">
                        <div className="text-s">Search for themes instead?</div>
                      </Box>
                      <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
                        <ThemeIcons variant="alternate" themeOnly={true} />
                      </Box>
                    </div>
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
