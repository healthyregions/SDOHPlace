import { useEffect, useState, useRef, use, useMemo } from "react";
import { SolrObject } from "meta/interface/SolrObject";
import { CircularProgress, debounce, Grid } from "@mui/material";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import DetailPanel from "./detailPanel/detailPanel";
import SearchRow from "./searchArea/searchRow";
import ResultsPanel from "./resultsPanel/resultsPanel";
import { SearchUIConfig } from "../searchUIConfig";
import MapPanel from "./mapPanel/mapPanel";
import { GetAllParams, reGetFilterQueries } from "./helper/ParameterList";
import FilterPanel from "./filterPanel/filterPanel";

export default function DiscoveryArea({ schema }: { schema: {} }): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [checkboxes, setCheckboxes] = useState([]);
  // let tempSRChecboxes = new Set<CheckBoxObject>();
  // SearchUIConfig.search.searchBox.spatialResOptions.forEach((option) => {
  //   tempSRChecboxes.add({
  //     attribute: "spatial_resolution",
  //     value: option.value,
  //     checked: searchParams.get("layers")
  //       ? searchParams.get("layers").toString().includes(option.value)
  //       : false,
  //     displayName: option.display_name,
  //   });
  // });
  const [options, setOptions] = useState([]);
  const [resetStatus, setResetStatus] = useState(true);

  let searchQueryBuilder = useMemo(() => new SolrQueryBuilder(), []);
  searchQueryBuilder.setSchema(schema);

  /**
   * ***************
   * URL Parameter Handling
   */
  const [initialLoad, setInitialLoad] = useState(true);
  const params = GetAllParams();
  const [inputValue, setInputValue] = useState<string>(
    params.query ? params.query : ""
  );
  const [value, setValue] = useState<string | null>(
    params.query ? params.query : null
  );
  const isQuery = params.query.length > 0;
  const filterQueries = reGetFilterQueries(params);
  // const originalResults = generateSolrObjectList(
  //   results,
  //   params.sortBy,
  //   params.sortOrder
  // );

  /**
   * ***************
   * Helper functions
   */
  const [fetchResults, setFetchResults] = useState<SolrObject[]>([]);
  const [relatedResults, setRelatedResults] = useState<SolrObject[]>([]);
  const [updateKey, setUpdateKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  let controller;
  const debouncedHandleSearch = debounce(
    (params, value, filterQueries, callback) => {
      callback(params, value, filterQueries);
    },
    300
  );
  const asyncSearch = async (params, value, filterQueries) => {
    if (!params || !filterQueries) {
      return;
    }
    setIsLoading(true);
    const suggestionController = new AbortController(); // for suggestion fetch
    const searchController = new AbortController(); // for search fetch
    const searchPromise = async () => {
      const searchValue = value
        ? value.length > 50
          ? value.split(" ").slice(0, 5).join(" ")
          : value
        : "";

      try {
        const safeFilterQueries = filterQueries || [];
        searchQueryBuilder.combineQueries(searchValue, safeFilterQueries);

        const resultResponse = await searchQueryBuilder.fetchResult(
          searchController.signal
        );

        const newResults = generateSolrObjectList(
          resultResponse,
          params.sortBy || "relevance",
          params.sortOrder || "desc"
        );

        setFetchResults(newResults);
      } catch (error) {
        if (error.name === "TypeError" && error.message.includes("URL")) {
          console.error("Invalid URL parameters:", {
            searchValue,
            filterQueries,
            params: {
              sortBy: params.sortBy,
              sortOrder: params.sortOrder,
              bboxParam: params.bboxParam,
            },
          });
        } else if (error.name !== "AbortError") {
          console.error("Error fetching main results:", error);
        }
      }
    };
    if (
      params.query &&
      params.query !== "*" &&
      params.query !== "" &&
      params.prevAction !== "filter" &&
      params.prevAction !== "sort"
    ) {
      setRelatedResults([]);
      setIsLoading(true);
      try {
        if (controller) {
          controller.abort();
          // Cancel any existing suggestion fetch request before starting a new one to prevent the old suggestion overwriting the new one
        }
        controller = suggestionController;
        const suggestResult = await searchQueryBuilder
          .suggestQuery(value)
          .fetchResult(controller.signal);
        // handle suggestions for similar results
        const suggestions =
          suggestResult["suggest"]["sdohSuggester"][value].suggestions || [];
        const validSuggestions = suggestions
          .filter(
            (suggestion) =>
              suggestion.weight >= 50 &&
              suggestion.term !== value &&
              suggestion.payload === "false"
          )
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 10); // for suggestions with weight >= 50, get the top 10 suggestions with the highest weight
        const batchSize = 10; // run in batch to prevent delay
        const clearRelatedResults = [];
        for (let i = 0; i < validSuggestions.length; i += batchSize) {
          const batch = validSuggestions.slice(i, i + batchSize);
          try {
            const batchResults = await Promise.all(
              batch.map((suggestion) =>
                searchQueryBuilder
                  .generalQuery(
                    suggestion.term.length > 50
                      ? `${suggestion.term.split(" ").slice(0, 5).join(" ")}`
                      : suggestion.term
                  ) //get the first 5 words of the suggestion
                  .fetchResult(controller.signal)
              )
            );
            batchResults.forEach((results) => {
              results.forEach((parent) => {
                if (
                  !clearRelatedResults.some((child) => child.id === parent.id)
                ) {
                  clearRelatedResults.push(parent);
                }
              });
            });
          } catch (error) {
            if (error.name === "AbortError") {
              break;
            }
          }
        }
        setRelatedResults(clearRelatedResults);
        setUpdateKey((prevKey) => prevKey + 1);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error during fetch operation:", error);
        }
      } finally {
        setInitialLoad(false);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    await searchPromise();
  };
  const handleSearch = (params, value, filterQueries) => {
    const safeValue = value || "";
    const safeFilters = Array.isArray(filterQueries) ? filterQueries : [];
    debouncedHandleSearch(params, safeValue, safeFilters, asyncSearch);
  };
  /**
   * ***************
   * Query & Search Input handling
   */
  const [isResetting, setIsResetting] = useState(false);
  const [highlightIds, setHighlightIds] = useState([]);
  const [highlightLyr, setHighlightLyr] = useState("");

  const handleInputReset = () => {
    setValue("*");
    setInputValue("*");
    params.setQuery("*");
    params.setShowDetailPanel(null);
    setIsResetting(true);
  };

  /**
   * ***************
   * Filter & Sort Component
   */

  const filterComponent = (
    <FilterPanel
      handleInputReset={handleInputReset}
      handleSearch={handleSearch}
      originalList={fetchResults}
      term={isQuery ? params.query : "*"}
      optionMaxNum={7}
      filterQueries={filterQueries}
      showFilter={params.showFilter ? params.showFilter : ""}
      setShowFilter={params.setShowFilter}
      sortOrder={params.sortOrder ? params.sortOrder : ""}
      setSortOrder={params.setSortOrder}
      sortBy={params.sortBy ? params.sortBy : ""}
      setSortBy={params.setSortBy}
    />
  );
  useEffect(() => {
    if (isResetting) {
      setAutocompleteKey((prevKey) => prevKey + 1);
      setCheckboxes([]);
      setOptions([]);
      setResetStatus(true);
      setIsResetting(false);
      setRelatedResults([]);
      handleSearch(params, "*", reGetFilterQueries(params));
    } else if (params.query && params.query !== "") {
      handleSearch(params, params.query, reGetFilterQueries(params));
    } else {
      handleSearch(params, "*", reGetFilterQueries(params));
    }
    setInitialLoad(false);
  }, [
    params.sortBy,
    params.sortOrder,
    params.indexYear,
    params.subject,
    params.query,
    params.bboxParam,
    params.bboxSearch,
    isResetting,
  ]);
  return (
    <Grid container>
      <Grid className="w-full px-[1em] sm:px-[2em] sm:mt-32 max-md:max-w-full shadow-none aspect-ratio bg-lightviolet">
        <Grid container className="container mx-auto pt-[2em] sm:pt-0">
          <SearchRow
            header={SearchUIConfig.search.headerRow.title}
            description={SearchUIConfig.search.headerRow.subtitle}
            schema={schema}
            autocompleteKey={autocompleteKey}
            options={options}
            handleInputReset={handleInputReset}
            setOptions={setOptions}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            value={value}
            setValue={setValue}
            setQuery={params.setQuery}
            handleSearch={handleSearch}
            filterQueries={filterQueries}
          />
        </Grid>
      </Grid>
      <Grid className="w-full px-[1em] sm:px-[2em]">
        <Grid container className="container mx-auto pt-[1em] ">
          <Grid item xs={12} sm={4}>
            {isLoading && initialLoad ? (
              <div className="flex justify-center items-center h-64">
                Loading result data <CircularProgress />
              </div>
            ) : (
              <ResultsPanel
                isLoading={isLoading}
                updateKey={updateKey}
                resultsList={fetchResults}
                relatedList={relatedResults}
                isQuery={isQuery || filterQueries.length > 0}
                filterComponent={filterComponent}
                showFilter={params.showFilter}
                setShowFilter={params.setShowFilter}
                setHighlightLyr={setHighlightLyr}
                setHighlightIds={setHighlightIds}
                handleSearch={handleSearch}
                handleInputReset={handleInputReset}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} className="sm:ml-[0.5em]">
            <MapPanel
              showMap={
                isResetting || params.showDetailPanel.length == 0
                  ? "block"
                  : "none"
              }
              resultsList={fetchResults}
              highlightLyr={highlightLyr}
              highlightIds={highlightIds}
              handleSearch={handleSearch}
            />
            <Grid
              sx={{
                display: params.showDetailPanel.length > 0 ? "block" : "none",
              }}
            >
              <DetailPanel
                fetchResults={fetchResults}
                relatedResults={relatedResults}
                setShowDetailPanel={params.setShowDetailPanel}
                showSharedLink={params.showSharedLink}
                setShowSharedLink={params.setShowSharedLink}
                handleSearch={handleSearch}
                handleInputReset={handleInputReset}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
