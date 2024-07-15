import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { SearchObject } from "./interface/SearchObject";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import ParentList from "./parentList";
import { generateSolrParentList } from "meta/helper/solrObjects";
import FilterObject from "./interface/FilterObject";
import { generateFilter, runningFilter } from "./helper/FilterHelpMethods";
import MapArea from "../map/mapArea";
import CheckBoxObject from "../search/interface/CheckboxObject";
import ResultCard from "./resultCard";
import DetailPanel from "./detailPanel/detailPanel";

import { updateSearchParams } from "@/components/search/helper/ManageURLParams";
import IconMatch from "./helper/IconMatch";

export default function SearchArea({
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
  const [fetchResults, setFetchResults] = useState<SolrObject[]>(
    generateSolrParentList(results)
  );
  const [originalResults, setOriginalResults] =
    useState<SolrObject[]>(fetchResults); // last step, probably move this to memory in the future
  const [allResults, setAllResults] = useState<SolrObject[]>(fetchResults); // the initial results
  const [queryData, setQueryData] = useState<SearchObject>({
    userInput: "",
  });
  const [autocompleteKey, setAutocompleteKey] = useState(0); // force autocomplete to re-render when user clicks on clear results
  const [checkboxes, setCheckboxes] = useState([]);

  let tempSRChecboxes = new Set<CheckBoxObject>();

  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const spatialResOptions = [
    {
      value: "state",
      display_name: "State",
    },
    {
      value: "county",
      display_name: "County",
    },
    {
      value: "zcta",
      display_name: "Zip Code",
    },
    {
      value: "tract",
      display_name: "Tract",
    },
    {
      value: "bg",
      display_name: "Block Group",
    },
    {
      value: "place",
      display_name: "City",
    },
  ];

  spatialResOptions.forEach((option) => {
    tempSRChecboxes.add({
      attribute: "special_resolution", // not sure where this attribute property is used?
      value: option.value,
      checked: searchParams.get("layers")
        ? searchParams.get("layers").toString().includes(option.value)
        : false,
      displayName: option.display_name,
    });
  });
  const [sRCheckboxes, setSRCheckboxes] = useState(
    new Set<CheckBoxObject>(tempSRChecboxes)
  ); // Special Resolution checkboxes
  const [options, setOptions] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [resetStatus, setResetStatus] = useState(true);
  const [queryString, setQueryString] = useState(null);
  const constructFilter = filterAttributeList.map((filter) => {
    return {
      [filter.attribute]: {},
    };
  });
  const [currentFilter, setCurrentFilter] = useState(
    constructFilter as unknown as FilterObject
  );

  let searchQueryBuilder = new SolrQueryBuilder();
  searchQueryBuilder.setSchema(schema);
  let suggestResultBuilder = new SuggestedResult();

  const handleSearch = async (value) => {
    searchQueryBuilder
      .fetchResult()
      .then((result) => {
        processResults(result, value);
        // if multiple terms are returned, we get all weight = 1 terms (this is done in SuggestionsResultBuilder), then aggregate the results for all terms
        if (suggestResultBuilder.getTerms().length > 0) {
          const multipleResults = [] as SolrObject[];
          suggestResultBuilder.getTerms().forEach((term) => {
            searchQueryBuilder.generalQuery(term);
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
              const newFilter = generateFilter(
                newResults,
                checkboxes,
                filterAttributeList.map((filter) => filter.attribute)
              );
              setCurrentFilter(newFilter);
              setOriginalResults(newResults);
              setFetchResults(newResults);
            });
          });
        } else {
          searchQueryBuilder.generalQuery(value);
          searchQueryBuilder.fetchResult().then((result) => {
            const newResults = generateSolrParentList(result);
            setCurrentFilter(
              generateFilter(
                newResults,
                checkboxes,
                filterAttributeList.map((filter) => filter.attribute)
              )
            );
            setOriginalResults(newResults);
            setFetchResults(newResults);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching result:", error);
      });
  };

  const handleUserInputChange = async (event, value) => {
    setQueryData({
      ...queryData,
      userInput: value,
    });
    if (value !== "") {
      searchQueryBuilder.suggestQuery(value);
      searchQueryBuilder
        .fetchResult()
        .then((result) => {
          processResults(result, value);
          setOptions(suggestResultBuilder.getTerms());
        })
        .catch((error) => {
          console.error("Error fetching result:", error);
        });
    } else {
      handleReset();
    }
  };

  // parse search params and update specific reactive values only if they have changed
  useEffect(() => {
    const newQueryString = searchParams.get("query");
    if (newQueryString && newQueryString != queryString) {
      setQueryString(newQueryString);
    }
  }, [searchParams, queryString]);

  // whenever the query string changes in the url params, run a search
  // ultimately, handleSearch should also be called if the filters change,
  // and it should take no inputs, as all of the inputs should be gathered
  // at time of search from url params.
  useEffect(() => {
    if (queryString) {
      searchQueryBuilder.suggestQuery(queryString);
      handleSearch(queryString);
    }
  }, [queryString]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateSearchParams(
      router,
      searchParams,
      currentPath,
      "query",
      userInput,
      "overwrite"
    );
  };
  const handleDropdownSelect = (event, value) => {
    updateSearchParams(
      router,
      searchParams,
      currentPath,
      "query",
      value,
      "overwrite"
    );
  };
  const processResults = (results, value) => {
    suggestResultBuilder.setSuggester("mySuggester"); //this could be changed to a different suggester
    suggestResultBuilder.setSuggestInput(value);
    suggestResultBuilder.setResultTerms(JSON.stringify(results));
  };
  const handleReset = () => {
    setAutocompleteKey(autocompleteKey + 1);
    setCheckboxes([]);
    setCurrentFilter(
      generateFilter(
        allResults,
        [],
        filterAttributeList.map((filter) => filter.attribute)
      )
    );
    setFetchResults(allResults);
    setResetStatus(true);
  };
  const handleFilter = (attr, value) => (event) => {
    setResetStatus(!resetStatus);
    const newCheckboxes = [...checkboxes];
    if (!newCheckboxes.find((c) => c.value === value && c.attribute === attr)) {
      newCheckboxes.push({
        attribute: attr,
        value: value,
        checked: event.target.checked,
      });
    }
    newCheckboxes.find(
      (c) => c.value === value && c.attribute === attr
    ).checked = event.target.checked;

    runningFilter(newCheckboxes, originalResults, schema).then((newResults) => {
      setFetchResults(newResults);
      setCurrentFilter(
        generateFilter(
          newResults,
          newCheckboxes,
          filterAttributeList.map((filter) => filter.attribute)
        )
      );
    });
    setCheckboxes(newCheckboxes);
  };

  useEffect(() => {
    const generateFilterFromCurrentResults = generateFilter(
      fetchResults,
      checkboxes,
      filterAttributeList.map((filter) => filter.attribute)
    );
    setCurrentFilter(generateFilterFromCurrentResults);
  }, [sRCheckboxes]);

  /** Handle the switch of detail panel and map */
  const [showMap, setShowMap] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(null);
  useEffect(() => {
    const showMapChange = (url) => {
      const params = new URLSearchParams(
        new URL(url, window.location.origin).search
      );
      const showParam = params.get("show");
      setShowMap(showParam && showParam !== "");
      setShowDetailPanel(showParam);
    };
    showMapChange(window.location.href);
    router.events.on("routeChangeComplete", showMapChange);
    return () => {
      router.events.off("routeChangeComplete", showMapChange);
    };
  }, [router.events]);

  /** Components */
  function FilterAccordion({
    key,
    currentCheckboxes,
    currentFilter,
    attributeName,
    displayName,
  }) {
    return currentFilter.hasOwnProperty(attributeName) ? (
      <Accordion defaultExpanded={false} key={key}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="year-content"
          id="year-header"
        >
          <Typography
            sx={{
              color:
                currentCheckboxes.find(
                  (e) => e.attribute === attributeName && e.checked
                ) === undefined
                  ? "black"
                  : "green",
            }}
          >
            {displayName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(currentFilter[attributeName]).map((s) => {
            return (
              <div key={s}>
                <span>
                  {s}:{currentFilter[attributeName][s].number}
                </span>
                <Checkbox
                  sx={{
                    display: s.length > 0 ? "inline" : "none",
                  }}
                  checked={currentFilter[attributeName][s].checked}
                  value={{
                    [attributeName]: s,
                  }}
                  onChange={handleFilter(attributeName, s)}
                />
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    ) : null;
  }
  function filterStatusButton(c: CheckBoxObject) {
    return (
      <Button
        key={c.value}
        sx={{ margin: "0.5em" }}
        variant="outlined"
        color="success"
        endIcon={<CloseIcon />}
        onClick={() => {
          const cancelEvent = {
            target: { checked: false },
          };
          handleFilter(c.attribute, c.value)(cancelEvent);
        }}
      >
        {c.attribute}:{c.value}
      </Button>
    );
  }

  const handleSRSelectionChange = (event) => {
    const { value, checked } = event.target;

    updateSearchParams(
      router,
      searchParams,
      currentPath,
      "layers",
      value,
      checked ? "add" : "remove"
    );

    // Create a new Set with updated checkboxes
    const updatedSet = new Set(
      Array.from(sRCheckboxes).map((obj) => {
        if (obj.value === value) {
          // Update the checkbox's checked property
          return { ...obj, checked: checked };
        }
        return obj;
      })
    );
    // Update the state with the new Set and log the updated state
    setSRCheckboxes(updatedSet);

    // Update another state (resetStatus)
    setResetStatus(!resetStatus);
  };

  return (
    <Grid container height={"calc(100vh - 172px)"}>
      <Grid item height={"100%"} sx={{ overflow: "scroll" }} xs={3}>
        <Grid item xs={12} sx={{ background: "#ECE6F0" }}>
          {/* ViewOnly's width is set to 499px, same to design as example */}
          {/* Result Card's width is set to fill its container's width */}
          {
            fetchResults.map((result) => (
              <ResultCard key={result.id} resultItem={result} />
            ))
          }
          <h5>Spatial Resolution</h5>
          {Array.from(sRCheckboxes).map((checkbox, index) => (
            <span key={index}>
              <span>{checkbox.displayName}</span>
              <Checkbox
                checked={checkbox.checked}
                value={checkbox.value}
                onChange={handleSRSelectionChange}
              />
            </span>
          ))}
        </Grid>
        <Grid container className="search_box_container">
          <form id="search-form" onSubmit={handleSubmit}>
            <Grid container alignItems="center">
              <Grid item xs={9}>
                <Autocomplete
                  key={autocompleteKey}
                  freeSolo
                  options={options}
                  defaultValue={searchParams.get("query"?.toString()) || ""}
                  onInputChange={(event, value, reason) => {
                    if (event && event.type === "change") {
                      setUserInput(value);
                      handleUserInputChange(event, value);
                    }
                  }}
                  onChange={(event, value) => {
                    setUserInput(value);
                    handleDropdownSelect(event, value);
                  }}
                  sx={{ minWidth: 250 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      placeholder="Search"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null,
                        type: "search",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          {checkboxes
            .filter((c) => c.checked === true)
            .map((c) => filterStatusButton(c))}
        </Box>
        <ParentList
          solrParents={fetchResults}
          filterAttributeList={filterAttributeList}
        />
        <Divider />
        <Grid container className="search_filter_container">
          {checkboxes.find((c) => c.checked) !== undefined ||
          (userInput && userInput.length > 0) ? (
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  handleReset();
                }}
              >
                Start Over
              </Button>
            </Grid>
          ) : null}

          {/* IMPORTANT: for filter name, use the key from the schema as function parameter and value */}
          <Grid item xs={12}>
            <h3>Filter Based on Search Result</h3>
            {filterAttributeList.map((filter, index) => (
              <FilterAccordion
                key={index}
                currentCheckboxes={checkboxes}
                currentFilter={currentFilter}
                attributeName={filter.attribute}
                displayName={filter.displayName}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid item height={"100%"} xs={1}></Grid>
      {fetchResults.length > 0 ? (
        // Using grid system, the right panel is around 8
        <Grid item xs={8}>
          <div style={{ display: showMap ? "none" : "block" }}>
            <MapArea
              searchResult={fetchResults}
              resetStatus={resetStatus}
              srChecked={sRCheckboxes}
            />
          </div>
          <DetailPanel
            resultItem={fetchResults.find((r) => r.id === showDetailPanel)}
          />
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
