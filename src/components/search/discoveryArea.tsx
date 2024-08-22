import { useEffect, useState, useRef, use, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { SearchObject } from "./interface/SearchObject";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import { generateSolrParentList } from "meta/helper/solrObjects";
import FilterObject from "./interface/FilterObject";
import { generateFilter, runningFilter } from "./helper/FilterHelpMethods";
import CheckBoxObject from "./interface/CheckboxObject";
import DetailPanel from "./detailPanel/detailPanel";
import { updateSearchParams } from "@/components/search/helper/ManageURLParams";
import SearchRow from "./searchArea/searchRow";
import ResultsPanel from "./resultsPanel/resultsPanel";
import { SearchUIConfig } from "../searchUIConfig";
import MapPanel from "./mapPanel/mapPanel";
import { Search } from "@mui/icons-material";
import { GetAllParams } from "./helper/ParameterList";
import { fi } from "date-fns/locale";
import { set } from "date-fns";
import { findSolrAttribute } from "meta/helper/util";

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
  const [fetchResults, setFetchResults] = useState<SolrObject[]>(
    generateSolrParentList(results)
  );
  const [originalResults, setOriginalResults] =
    useState<SolrObject[]>(fetchResults); // last step, probably move this to memory in the future
  const [allResults, setAllResults] = useState<SolrObject[]>(fetchResults); // the initial results
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const initialSearchInput = useQueryState("query", parseAsString)[0];
  const [inputValue, setInputValue] = useState<string>(initialSearchInput);
  const [value, setValue] = useState<string | null>(initialSearchInput);
  const [checkboxes, setCheckboxes] = useState([]);
  let tempSRChecboxes = new Set<CheckBoxObject>();
  SearchUIConfig.search.searchBox.spatialResOptions.forEach((option) => {
    tempSRChecboxes.add({
      attribute: "special_resolution", // not sure where this attribute property is used?
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
  let suggestResultBuilder = new SuggestedResult();
  // get all query status
  const {
    isQuery,
    showDetailPanel,
    setShowDetailPanel,
    showSharedLink,
    setShowSharedLink,
    showFilter,
    resource_type,
    resource_class,
    format,
    index_year,
    query,
  } = GetAllParams();

  // For filter, re-build filterQuery using SearchQueryBuilder
  const filterQueries = [];
  if (resource_type[0].length > 0) {
    resource_type[0].split(",").forEach((r) => {
      filterQueries.push({
        attribute: "resource_type",
        value: r,
      });
    });
  }
  if (resource_class[0].length > 0) {
    resource_class[0].split(",").forEach((r) => {
      filterQueries.push({
        attribute: "resource_class",
        value: r,
      });
    });
  }
  if (format[0].length > 0) {
    format[0].split(",").forEach((f) => {
      filterQueries.push({ attribute: "format", value: f });
    });
  }
  if (index_year[0].length > 0) {
    index_year[0].split(",").forEach((i) => {
      filterQueries.push({ attribute: "index_year", value: i });
    });
  }

  // Run filter only if no query is present or searchInputBox is set to no value,
  // Otherwise use the handleSearch that also has filter included
  useEffect(() => {
    if (query[0].length === 0 || inputValue === null) filterOnly();
  }, [inputValue]);
  const combineGeneralAndFilter = (term) => {
    let combinedQuery = searchQueryBuilder.generalQuery(term).getQuery();
    if (filterQueries.length > 0) {
      let filterQuery = `&fq=`;
      filterQueries.forEach((term) => {
        filterQuery += `${encodeURIComponent(
          findSolrAttribute(term.attribute, searchQueryBuilder.getSchema())
        )}:"${encodeURIComponent(term.value)}" AND `;
      });
      filterQuery = filterQuery.slice(0, -5);
      combinedQuery += filterQuery;
    }
    combinedQuery += "&rows=1000";
    searchQueryBuilder.setQuery(
      combinedQuery.replace(searchQueryBuilder.getSolrUrl() + "/", "")
    );
  };
  const filterOnly = () => {
    if (filterQueries.length > 0) {
      searchQueryBuilder.filterQuery(filterQueries);
      searchQueryBuilder
        .fetchResult()
        .then((result) => {
          const newResults = generateSolrParentList(result);
          setFetchResults(newResults);
        })
        .catch((error) => {
          console.error("Error fetching result:", error);
        });
    }
  };
  const handleSearch = async (value) => {
    searchQueryBuilder
      .fetchResult()
      .then((result) => {
        console.log("handleSearch", result, value);
        processResults(result, value);
        console.log("suggestResultBuilder", suggestResultBuilder.getTerms());
        // if multiple terms are returned, we get all weight = 1 terms (this is done in SuggestionsResultBuilder), then aggregate the results for all terms
        if (suggestResultBuilder.getTerms().length > 0) {
          const multipleResults = [] as SolrObject[];
          suggestResultBuilder.getTerms().forEach((term) => {
            combineGeneralAndFilter(term);
            searchQueryBuilder.fetchResult().then((result) => {
              generateSolrParentList(result).forEach((parent) => {
                multipleResults.push(parent);
              });
              // remove duplicates by id
              const newResults = Array.from(
                new Set(multipleResults.map((a) => a.id))
              ).map((id) => {
                return multipleResults.find((a) => a.id === id);
              });
              setOriginalResults(newResults);
              setFetchResults(newResults);
            });
          });
        } else {
          combineGeneralAndFilter(value);
          searchQueryBuilder.fetchResult().then((result) => {
            const newResults = generateSolrParentList(result);
            setOriginalResults(newResults);
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
  const handleInputReset = () => {
    console.log("handleInputReset");
    setAutocompleteKey((prevKey) => prevKey + 1);
    setCheckboxes([]);
    setOptions([]);
    setValue(null);
    setInputValue("");
    setResetStatus(true);
    // since only input got reset, we need to re-run the filter
    filterOnly();
  };

  // For suggestion
  const [newQueryString, setNewQueryString] = useQueryState(
    "query",
    parseAsString
  );
  const [queryString, setQueryString] = useState(newQueryString);
  useEffect(() => {
    if (newQueryString && newQueryString !== queryString) {
      setQueryString(newQueryString);
    }
  }, [newQueryString, queryString]);
  // Run `suggestQuery` first, then `handleSearch`
  useEffect(() => {
    if (queryString) {
      searchQueryBuilder.suggestQuery(queryString);
      handleSearch(queryString);
    }
  }, [queryString]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <SearchRow
          header={SearchUIConfig.search.headerRow.title}
          description={SearchUIConfig.search.headerRow.subtitle}
          schema={schema}
          autocompleteKey={autocompleteKey}
          options={options}
          setOptions={setOptions}
          handleInputReset={handleInputReset}
          inputValue={inputValue}
          setInputValue={setInputValue}
          value={value}
          setValue={setValue}
          inputRef={inputRef}
          handleSearch={handleSearch}
        />
      </Grid>
      {fetchResults.length > 0 && (
        <Grid item className="sm:px-[2em]" xs={12} sm={4}>
          <ResultsPanel
            resultsList={fetchResults}
            relatedList={fetchResults}
            isQuery={isQuery[0].length > 0 || filterQueries.length > 0}
          />
        </Grid>
      )}
      {fetchResults.length > 0 ? (
        <Grid item xs={8} className="sm:ml-[0.5em]">
          <Grid
            item
            className="sm:px-[2em]"
            xs={12}
            sx={{ display: showDetailPanel.length == 0 ? "block" : "none" }}
          >
            <MapPanel resultsList={fetchResults} />
          </Grid>
          <Grid
            sx={{ display: showDetailPanel.length > 0 ? "block" : "none" }}
          >
            <DetailPanel
              resultItem={fetchResults.find((r) => r.id === showDetailPanel)
              }
              setShowDetailPanel={setShowDetailPanel}
              showSharedLink={showSharedLink}
              setShowSharedLink={setShowSharedLink}
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
