import { useEffect, useState, useRef, use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SolrObject } from "meta/interface/SolrObject";
import { Grid } from "@mui/material";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import { generateSolrObjectList } from "meta/helper/solrObjects";
import DetailPanel from "./detailPanel/detailPanel";
import SearchRow from "./searchArea/searchRow";
import ResultsPanel from "./resultsPanel/resultsPanel";
import { SearchUIConfig } from "../searchUIConfig";
import MapPanel from "./mapPanel/mapPanel";
import { GetAllParams, reGetFilterQueries } from "./helper/ParameterList";
import FilterPanel from "./filterPanel/filterPanel";

export default function DiscoveryArea({
  results,
  schema,
}: {
  results: SolrObject[];
  schema: {};
}): JSX.Element {
  const searchParams = useSearchParams();
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
  let suggestResultBuilder = useMemo(() => new SuggestedResult(), []);

  /**
   * ***************
   * Helper functions
   */
  const handleSearch = async (params, value, filterQueries) => {
    if (params.query !== "*" && params.query && params.query.length > 0) {
      value = params.query;
      suggestResultBuilder.setSuggestInput(value);
      suggestResultBuilder.setSuggester("sdohSuggester");
      searchQueryBuilder
        .suggestQuery(value)
        .fetchResult()
        .then((result) => {
          // if returned suggestions's weight > 5, search each term and put result into SimilarResults section
          if (
            result["suggest"]["sdohSuggester"][value].suggestions.length === 0
          ) {
            setRelatedResults([]);
          } else {
            result["suggest"]["sdohSuggester"][value].suggestions.forEach(
              (suggestion) => {
                if (suggestion.weight > 5) {
                  const term = suggestion.term;
                  searchQueryBuilder.generalQuery(term);
                  searchQueryBuilder.fetchResult().then((res) => {
                    generateSolrObjectList(
                      res,
                      params.sortBy,
                      params.sortOrder
                    ).forEach((parent) => {
                      setRelatedResults((prev) => {
                        return [...prev, parent];
                      });
                    });
                  });
                }
              }
            );
          }
        });
    }
    searchQueryBuilder.combineQueries(value, filterQueries);
    searchQueryBuilder
      .fetchResult()
      .then((result) => {
        let newResults = generateSolrObjectList(
          result,
          params.sortBy,
          params.sortOrder
        );
        setFetchResults(newResults);
      })
      .catch((error) => {
        console.error("Error fetching result:", error);
      });
  };
  const processResults = (results, value) => {
    suggestResultBuilder.setSuggester("sdohSuggester"); //this could be changed to a different suggester
    suggestResultBuilder.setSuggestInput(value);
    suggestResultBuilder.setResultTerms(JSON.stringify(results));
    return suggestResultBuilder.getTerms();
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
  const originalResults = generateSolrObjectList(
    results,
    params.sortBy,
    params.sortOrder
  );
  const [fetchResults, setFetchResults] =
    useState<SolrObject[]>(originalResults);
  const [relatedResults, setRelatedResults] = useState<SolrObject[]>([]);

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
    } else {
      handleSearch(params, params.query, reGetFilterQueries(params));
    }
  }, [
    params.sortBy,
    params.sortOrder,
    params.indexYear,
    params.subject,
    params.query,
    params.showDetailPanel,
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
          filterQueries={filterQueries}
        />
      </Grid>
      <Grid item className="sm:px-[2em]" xs={12} sm={4}>
        <ResultsPanel
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