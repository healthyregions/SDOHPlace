import { useEffect, useState, useRef, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SolrObject } from "meta/interface/SolrObject";
import { Grid, Typography } from "@mui/material";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import { generateSolrParentList } from "meta/helper/solrObjects";
import { filterResults } from "./helper/FilterHelpMethods";
import CheckBoxObject from "./interface/CheckboxObject";
import DetailPanel from "./detailPanel/detailPanel";
import SearchRow from "./searchArea/searchRow";
import ResultsPanel from "./resultsPanel/resultsPanel";
import { SearchUIConfig } from "../searchUIConfig";
import MapPanel from "./mapPanel/mapPanel";
import {
  GetAllParams,
  reGetFilterQueries,
  updateAll,
} from "./helper/ParameterList";
import { findSolrAttribute } from "meta/helper/util";
import FilterPanel, { grouped } from "./filterPanel/filterPanel";
import SpatialResolutionCheck from "./searchArea/spatialResolutionCheck";
import { set } from "date-fns";
export default function DiscoveryArea({
  results,
  isLoading,
  filterAttributeList,
  schema,
}: {
  results: SolrObject[];
  isLoading: boolean;
  filterAttributeList: {
    attribute: string;
    displayName: string;
  }[];
  schema: {};
}): JSX.Element {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [checkboxes, setCheckboxes] = useState([]);
  let tempSRChecboxes = new Set<CheckBoxObject>();
  SearchUIConfig.search.searchBox.spatialResOptions.forEach((option) => {
    tempSRChecboxes.add({
      attribute: "spatial_resolution", // not sure where this attribute property is used?
      value: option.value,
      checked: searchParams.get("layers")
        ? searchParams.get("layers").toString().includes(option.value)
        : false,
      displayName: option.display_name,
    });
  });
  const [options, setOptions] = useState([]);
  const [resetStatus, setResetStatus] = useState(true);

  let searchQueryBuilder = useMemo(() => new SolrQueryBuilder(), []);
  searchQueryBuilder.setSchema(schema);
  let suggestResultBuilder = useMemo(() => new SuggestedResult(), []);

  /**
   * ***************
   * Helper functions
   */
  const handleSearch = async (params, value, filterQueries) => {
    searchQueryBuilder
      .fetchResult()
      .then((result) => {
        processResults(result, value);
        console.log("suggestResultBuilder", suggestResultBuilder.getTerms());
        // if multiple terms are returned, we get all weight = 1 terms (this is done in SuggestionsResultBuilder), then aggregate the results for all terms
        if (suggestResultBuilder.getTerms().length > 0) {
          const multipleResults = [] as SolrObject[];
          suggestResultBuilder.getTerms().forEach((term) => {
            searchQueryBuilder.combineQueries(term, filterQueries);
            searchQueryBuilder.fetchResult().then((result) => {
              generateSolrParentList(
                result,
                params.sortBy,
                params.sortOrder
              ).forEach((parent) => {
                multipleResults.push(parent);
              });
              // remove duplicates by id
              const newResults = Array.from(
                new Set(multipleResults.map((a) => a.id))
              ).map((id) => {
                return multipleResults.find((a) => a.id === id);
              });
              setFetchResults(newResults);
            });
          });
        } else {
          console.log("no suggestions, just one term", value, filterQueries);
          searchQueryBuilder.combineQueries(value, filterQueries);
          searchQueryBuilder.fetchResult().then((result) => {
            const newResults = generateSolrParentList(
              result,
              params.sortBy,
              params.sortOrder
            );
            setFetchResults(newResults);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching result:", error);
      });
  };
  const processResults = (results, value) => {
    suggestResultBuilder.setSuggester("mySuggester"); //this could be changed to a different suggester
    suggestResultBuilder.setSuggestInput(value);
    suggestResultBuilder.setResultTerms(JSON.stringify(results));
  };

  /**
   * ***************
   * URL Parameter Handling
   */
  const params = GetAllParams();
  const [inputValue, setInputValue] = useState<string>(
    params.query ? params.query : ""
  );
  const [value, setValue] = useState<string | null>(
    params.query ? params.query : null
  );
  const isQuery = params.query.length > 0;

  const filterQueries = reGetFilterQueries(params);
  const originalResults = generateSolrParentList(
    results,
    params.sortBy,
    params.sortOrder
  );
  const [fetchResults, setFetchResults] =
    useState<SolrObject[]>(originalResults);

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

  const handleInputReset = () => {
    setIsResetting(true);
  };

  useEffect(() => {
    if (isResetting) {
      params.setQuery(null);
      setAutocompleteKey((prevKey) => prevKey + 1);
      setCheckboxes([]);
      setOptions([]);
      setValue(null);
      setInputValue("");
      setResetStatus(true);
      setIsResetting(false);
      handleSearch(params, "*", reGetFilterQueries(params));
    } else {
      handleSearch(params, params.query, reGetFilterQueries(params));
    }
  }, [
    params.sortBy,
    params.sortOrder,
    params.resourceType,
    params.resourceClass,
    params.format,
    params.indexYear,
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
          processResults={processResults}
          setOptions={setOptions}
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          value={value}
          setValue={setValue}
          setQuery={params.setQuery}
          handleSearch={handleSearch}
        />
      </Grid>
      {fetchResults.length > 0 && (
        <Grid item className="sm:px-[2em]" xs={12} sm={4}>
          <ResultsPanel
            resultsList={fetchResults}
            relatedList={fetchResults}
            isQuery={isQuery || filterQueries.length > 0}
            filterComponent={filterComponent}
            showFilter={params.showFilter}
            setShowFilter={params.setShowFilter}
          />
        </Grid>
      )}
      {fetchResults.length > 0 ? (
        <Grid item xs={8} className="sm:ml-[0.5em]">
          <Grid
            item
            className="sm:px-[2em]"
            xs={12}
            sx={{
              display: params.showDetailPanel.length == 0 ? "block" : "none",
            }}
          >
            <MapPanel resultsList={fetchResults} />
          </Grid>
          <Grid
            sx={{
              display: params.showDetailPanel.length > 0 ? "block" : "none",
            }}
          >
            <DetailPanel
              resultItem={fetchResults.find(
                (r) => r.id === params.showDetailPanel
              )}
              setShowDetailPanel={params.setShowDetailPanel}
              showSharedLink={params.showSharedLink}
              setShowSharedLink={params.setShowSharedLink}
            />
          </Grid>
        </Grid>
      ) : isLoading ? (
        <Grid item xs={7}>
          {" "}
          <h1>Loading map...</h1>
        </Grid>
      ) : (
        <Grid item xs={7}>
          <h1>No results.</h1>
        </Grid>
      )}
    </Grid>
  );
}
