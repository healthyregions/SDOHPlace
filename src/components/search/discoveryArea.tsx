import { useEffect, useState, useRef, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SolrObject } from "meta/interface/SolrObject";
import { debounce, Grid } from "@mui/material";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import DetailPanel from "./detailPanel/detailPanel";
import SearchRow from "./searchArea/searchRow";
import ResultsPanel from "./resultsPanel/resultsPanel";
import { SearchUIConfig } from "../searchUIConfig";
import MapPanel from "./mapPanel/mapPanel";
import { GetAllParams, reGetFilterQueries } from "./helper/ParameterList";
import FilterPanel from "./filterPanel/filterPanel";
import { fi } from "date-fns/locale";
import { parseArgs } from "util";

export default function DiscoveryArea({
  results,
  schema,
}: {
  results: SolrObject[];
  schema: {};
}): JSX.Element {
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
  

  const params = GetAllParams();
  const [inputValue, setInputValue] = useState<string>(
    params.query ? params.query : ""
  );
  const [value, setValue] = useState<string | null>(
    params.query ? params.query : null
  );
  const isQuery = params.query.length > 0;
  const filterQueries = reGetFilterQueries(params);
  const originalResults = generateSolrObjectList(
    results,
    params.sortBy,
    params.sortOrder
  );

  /**
   * ***************
   * Helper functions
   */
  const [fetchResults, setFetchResults] =
    useState<SolrObject[]>(originalResults);
  const [relatedResults, setRelatedResults] = useState<SolrObject[]>([]);
  const [updateKey, setUpdateKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  let controller;
  const debouncedHandleSearch = debounce(
    (params, value, filterQueries, callback) => {
      callback(params, value, filterQueries);
    },
    10
  );
  const asyncSearch = async (params, value, filterQueries) => {
    const suggestionController = new AbortController(); // for suggestion fetch
    const searchController = new AbortController(); // for search fetch

    const searchPromise = async () => {
      searchQueryBuilder.combineQueries(value, filterQueries);
      try {
        const resultResponse = await searchQueryBuilder.fetchResult(
          searchController.signal
        );
        const newResults = generateSolrObjectList(
          resultResponse,
          params.sortBy,
          params.sortOrder
        );
        setFetchResults(newResults);
      } catch (error) {
        if (error.name !== "AbortError") {
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
        const validSuggestions = suggestions.filter(
          (suggestion) => suggestion.weight > 5 && suggestion.term !== value
        );
        const batchSize = 10; // run in batch to prevent delay
        const clearRelatedResults = [];
        for (let i = 0; i < validSuggestions.length; i += batchSize) {
          const batch = validSuggestions.slice(i, i + batchSize);
          try {
            const batchResults = await Promise.all(
              batch.map((suggestion) =>
                searchQueryBuilder
                  .generalQuery(suggestion.term)
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
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    await searchPromise();
  };
  const handleSearch = (params, value, filterQueries) => {
    debouncedHandleSearch(params, value, filterQueries, asyncSearch);
  };

  /**
   * ***************
   * URL Parameter Handling
   */

  /**
   * ***************
   * Filter & Sort Component
   */

  const filterComponent = (
    <FilterPanel
      originalList={originalResults}
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
    }
  }, [
    params.sortBy,
    params.sortOrder,
    params.indexYear,
    params.subject,
    params.query,
    isResetting,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
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
      <Grid item className="sm:px-[2em]" xs={12} sm={4}>
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
      </Grid>
      <Grid item xs={8} className="sm:ml-[0.5em]">
        {/* <Grid
          item
          className="sm:px-[2em]"
          xs={12}
          sx={{
            display: params.showDetailPanel.length == 0 ? "block" : "none",
          }}
        > */}
        <MapPanel
          showMap={
            isResetting || params.showDetailPanel.length == 0 ? "block" : "none"
          }
          resultsList={fetchResults}
          highlightLyr={highlightLyr}
          highlightIds={highlightIds}
        />
        {/* </Grid> */}
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
  );
}
