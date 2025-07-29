"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { clearMapPreview, setGeosearchSelection, setShowFilter } from "@/store/slices/uiSlice";
import { Box, SvgIcon, CircularProgress, Fade, Collapse, Alert, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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
import { clearError, reloadAiSearchFromUrl, setAISearch } from "@/store/slices/searchSlice";

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
  const { hasError, errorMessage, errorType, aiSearch } = useSelector((state: RootState) => state.search);
  const filterStatus = useSelector(getFilterStatus) as {
    hasActiveFilters: boolean;
    activeFilters: { [key: string]: boolean };
  };
  const plausible = usePlausible();
  const showFilter = useSelector((state: RootState) => state.ui.showFilter);
  const isLoading =
    searchState.isSearching ||
    searchState.isSuggesting;
  const isQuery =
    searchState.query && searchState.query !== "*" && searchState.query !== "";
  const [previousCount, setPreviousCount] = React.useState(
    searchState.results.length
  );
  const [isResetting, setIsResetting] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [hasTriedUrlReload, setHasTriedUrlReload] = React.useState(false);
  const [, forceUpdate] = React.useState({});
  const [hasSearchBeenInitiated, setHasSearchBeenInitiated] =
    React.useState(false);
  const [showNoResults, setShowNoResults] = React.useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = React.useState(false);
  const [prevResults, setPrevResults] = React.useState([]);
  const sortConfig = useSelector((state: RootState) => state.search.sort);
  const isAiSearch = useSelector((state: RootState) => state.search.aiSearch);
  const getSortedResults = React.useCallback((directResults, relatedResults) => {
    const allResults = [...directResults, ...relatedResults];
    if (sortConfig.sortBy === "score") {
      return allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortConfig.sortBy === "index_year") {
      return allResults.sort((a, b) => {
        const aYears = a.index_year || [];
        const bYears = b.index_year || [];
        if (aYears.length === 0 && bYears.length === 0) return 0;
        if (aYears.length === 0) return 1;
        if (bYears.length === 0) return -1;
        const aYearsNum = aYears.map(year => parseInt(year, 10)).filter(y => !isNaN(y));
        const bYearsNum = bYears.map(year => parseInt(year, 10)).filter(y => !isNaN(y));
        if (aYearsNum.length === 0 && bYearsNum.length === 0) return 0;
        if (aYearsNum.length === 0) return 1;
        if (bYearsNum.length === 0) return -1;
        const aValue = sortConfig.sortOrder === "desc" ? Math.max(...aYearsNum) : Math.min(...aYearsNum);
        const bValue = sortConfig.sortOrder === "desc" ? Math.max(...bYearsNum) : Math.min(...bYearsNum);
        return sortConfig.sortOrder === "desc" ? (bValue - aValue) : (aValue - bValue);
      });
    }
    return allResults;
  }, [sortConfig.sortBy, sortConfig.sortOrder]);
  
  const isNonLatinSearch = React.useMemo(() => {
    if (!searchState.query) return false;
    const nonLatinRegex = /[^\u0000-\u007F]/;
    return nonLatinRegex.test(searchState.query);
  }, [searchState.query]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasAiSearch = params.has("ai_search") && params.get("ai_search") === "true";
    if (!hasTriedUrlReload && !searchState.isSearching) {
      const query = params.get("query");
      if (
        hasAiSearch &&
        query &&
        query.trim() !== "" &&
        searchState.results.length === 0
      ) {
        setHasTriedUrlReload(true);
        if (hasAiSearch) {
          setIsInitialLoad(false);
        }
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
  }, [
    dispatch,
    hasTriedUrlReload,
    searchState.isSearching,
    searchState.results.length,
    props.schema,
  ]);

  React.useEffect(() => {
    if (searchState.results.length > 0 && !isLoading) {
      setPrevResults(searchState.results);
    }
  }, [searchState.results, isLoading]);

  const uniqueRelatedList = React.useMemo(() => {
    try {
      if (isLoading) {
        return [];
      }

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
  }, [searchState.relatedResults, searchState.results, isLoading]);

  const handleFilterToggle = () => {
    dispatch(setShowFilter(!showFilter));
  };

  const handleClearFilters = async () => {
    dispatch(clearMapPreview());
    dispatch(setGeosearchSelection(null));
    setIsResetting(true);
    await resetFilters(store);
    setTimeout(() => {
      setIsResetting(false);
      setIsInitialLoad(false);
      setHasCompletedSearch(true);
      setShowNoResults(true);
    }, 500);
  };

  const resultsToShow = React.useMemo(() => {
    if (searchState.aiSearch && isLoading && prevResults.length > 0) {
      return prevResults;
    }
    return searchState.results;
  }, [searchState.aiSearch, isLoading, prevResults, searchState.results]);
  
 
  const sortedResults = React.useMemo(() => {
    const directResults = resultsToShow;
    const relatedResults = uniqueRelatedList;
    return getSortedResults(directResults, relatedResults);
  }, [resultsToShow, uniqueRelatedList, getSortedResults]);

  const displayCount = React.useMemo(() => {
    if (isResetting || isLoading) {
      return previousCount;
    }
    if (sortedResults && sortedResults.length > 0) {
      return sortedResults.length;
    }
    const relatedCount = isLoading ? 0 : uniqueRelatedList.length;
    const totalCount = searchState.results.length + relatedCount;
    return totalCount;
  }, [
    isLoading,
    isResetting,
    previousCount,
    searchState.results.length,
    uniqueRelatedList.length,
    sortedResults
  ]);

  React.useEffect(() => {
    if (
      searchState.query &&
      searchState.query !== "" &&
      searchState.query !== "*"
    ) {
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
      if (!(searchState.aiSearch && prevResults.length > 0)) {
        setIsInitialLoad(true);
      }
    } else if (!isInitialLoad) {
      if (isNonLatinSearch && searchState.aiSearch) {
        setTimeout(() => {
          setHasCompletedSearch(true);
          setShowNoResults(true);
        }, 1000);
      } else {
        setHasCompletedSearch(true);
        setShowNoResults(true);
      }
    }
  }, [
    isLoading,
    isInitialLoad,
    isNonLatinSearch,
    searchState.aiSearch,
    prevResults.length
  ]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasSearchParams = params.has("query") || params.has("ai_search");
    const hasAiSearch = params.has("ai_search") && params.get("ai_search") === "true";

    if (hasSearchParams && !hasAiSearch) {
      setIsInitialLoad(true);
    }

    if (!isLoading) {
      if (
        searchState.results.length > 0 ||
        (searchState.relatedResults.length > 0 && !isLoading) ||
        hasCompletedSearch
      ) {
        if (isNonLatinSearch && searchState.aiSearch) {
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 500);
        } else {
          setIsInitialLoad(false);
        }
      } else if (hasSearchBeenInitiated) {
        setTimeout(() => {
          setIsInitialLoad(false);
          setHasCompletedSearch(true);
          setShowNoResults(true);
        }, 500);
      }

      const relatedCount = isLoading ? 0 : uniqueRelatedList.length;
      const totalCount = searchState.results.length + relatedCount;
      setPreviousCount(totalCount);
    } else if (!(searchState.aiSearch && prevResults.length > 0)) {
      setIsInitialLoad(true);
    }
  }, [
    isLoading,
    searchState.results.length,
    searchState.relatedResults.length,
    uniqueRelatedList.length,
    isResetting,
    hasCompletedSearch,
    isNonLatinSearch, 
    searchState.aiSearch,
    hasSearchBeenInitiated,
    prevResults.length
  ]);

  React.useEffect(() => {
    if (isLoading) {
      forceUpdate({});
      if (!(searchState.aiSearch && prevResults.length > 0)) {
        setIsInitialLoad(true);
      }
      setShowNoResults(false);
      if (searchState.aiSearch && !prevResults.length) {
        setPreviousCount(0);
      }
    } else if (hasSearchBeenInitiated || (filterStatus && filterStatus.hasActiveFilters)) {
      setTimeout(() => {
        if (searchState.results.length === 0 && uniqueRelatedList.length === 0) {
          setIsInitialLoad(false);
          setHasCompletedSearch(true);
          setShowNoResults(true);
        }
      }, 300);
    }
  }, [
    isLoading, 
    searchState.aiSearch, 
    searchState.results.length, 
    uniqueRelatedList.length, 
    hasSearchBeenInitiated, 
    isNonLatinSearch,
    prevResults.length,
    filterStatus
  ]);

  const renderLoadingState = () => {
    let loadingMessage;
    if (displayCount > 0) {
      loadingMessage = "Updating results...";
    } else {
      loadingMessage = "Searching for data you may be interested in...";
    }
    return (
      <Box className="flex flex-col w-full">
        <Box className="flex justify-center items-center h-64">
          <div className="text-center w-full px-4 py-3 rounded-lg bg-white">
            <span className="mr-4 text-lg transition-all duration-300 ease-in-out">
              {loadingMessage}
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

  const shouldShowLoading = React.useMemo(() => {
    if (filterStatus && 
        filterStatus.hasActiveFilters && 
        !isLoading && 
        !isResetting && 
        searchState.results.length === 0 && 
        uniqueRelatedList.length === 0) {
      return false;
    }
    
    return isLoading || isResetting || isInitialLoad || !showNoResults;
  }, [
    isLoading, 
    isResetting, 
    isInitialLoad, 
    showNoResults, 
    filterStatus, 
    searchState.results.length, 
    uniqueRelatedList.length
  ]);

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
            {filterStatus && filterStatus.hasActiveFilters && !isLoading && !isResetting && (
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
                  {sortedResults.length > 0 || displayCount > 0 ? (
                    <Box
                      height="100%"
                      sx={{
                        overflowY: "scroll",
                        paddingRight: "1.25em",
                        maxHeight: "100vh",
                      }}
                    >
                      {sortedResults.map((result) =>
                        result && result.id ? (
                          <div key={result.id} className="mb-[0.75em]">
                            <ResultCard resultItem={result} />
                          </div>
                        ) : null
                      )}
                    </Box>
                  ) : hasError ? (
                    <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
                      <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                        <ErrorOutlineIcon className="text-red-500 mb-3" sx={{ fontSize: 48 }} />
                        <div className="text-lg font-medium text-gray-800 mb-2">
                          {errorType === 'server' ? 'AI Search Service Unavailable' : 
                           errorType === 'network' ? 'Connection Issue' : 'Search Error'}
                        </div>
                      </Box>              
                      <Alert 
                        severity={errorType === 'network' ? 'warning' : 'error'}
                        className="mb-4"
                        sx={{
                          backgroundColor: errorType === 'network' ? '#fff3cd' : '#f8d7da',
                          borderColor: errorType === 'network' ? '#ffeaa7' : '#f5c6cb',
                          color: errorType === 'network' ? '#856404' : '#721c24',
                        }}
                      >
                        <div className="flex flex-col space-y-3">
                          <div className="text-sm">
                            {errorMessage}
                          </div>
                          {aiSearch && (
                            <Box className="flex flex-col sm:flex-row gap-3 mt-3">
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<SearchIcon />}
                                onClick={() => {
                                  dispatch(setAISearch(false));
                                  dispatch(clearError());
                                }}
                                sx={{
                                  backgroundColor: '#2563eb',
                                  '&:hover': { backgroundColor: '#1d4ed8' },
                                  textTransform: 'none',
                                  fontWeight: 500,
                                }}
                              >
                                Switch to Keyword Search
                              </Button>
                              <div className="text-xs text-gray-600 self-center">
                                Search for specific terms directly in our database
                              </div>
                            </Box>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => dispatch(clearError())}
                            sx={{
                              alignSelf: 'flex-start',
                              textTransform: 'none',
                              mt: 1
                            }}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </Alert>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
                      <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                        <SearchIcon className="text-strongorange my-[0.15em]" />
                        <div className="text-s">No results</div>
                        {(() => {
                          try {
                            if (process.env.NODE_ENV !== "development") {
                              plausible(EventType.ReceivedNoSearchResults, {
                                props: {
                                  searchQuery: searchState.query,
                                  searchFilter: filterStatus?.activeFilters || {},
                                  fullSearchStates:
                                    searchState.query +
                                    " || " +
                                    Object.entries(filterStatus?.activeFilters || {})
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
