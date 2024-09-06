/* eslint-disable react-hooks/rules-of-hooks */
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  Button,
  IconButton,
  Slider,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "meta/interface/SolrObject";
import { useEffect, useMemo, useState } from "react";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { generateFilterList, updateFilter } from "../helper/FilterHelpMethods";
import { GetAllParams, updateAll } from "../helper/ParameterList";

interface Props {
  originalList: SolrObject[];
  optionMaxNum: number;
  filterQueries: any;
  term: string;
  showFilter: string;
  setShowFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  filterPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
  },
}));

const filterNameLookup = SearchUIConfig.search.searchFilters.filters.reduce(
  (o, f) => ({ ...o, [f.attribute]: f.displayName }),
  {}
);

/**
 * Only show filter items in url
 * @param props
 * @returns
 */
const FilterPanel = (props: Props): JSX.Element => {
  const classes = useStyles();
  const params = GetAllParams();
  const labelStyle: SxProps<Theme> = {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    fontSize: "0.875em",
  };
  const checkBoxStyle: SxProps<Theme> = {
    color: `${fullConfig.theme.colors["frenchviolet"]}`,
    borderRadius: "2px",
    padding: "0.5em",
    "&.Mui-checked": {
      color: `${fullConfig.theme.colors["frenchviolet"]}`,
    },
  };
  const [
    generateFilterFromCurrentResults,
    setGenerateFilterFromCurrentResults,
  ] = React.useState(() => generateFilterList(props.originalList));
  let filterAttributes = useMemo(
    () => [
      ...SearchUIConfig.search.searchFilters.filters.map((d) => d.attribute),
      "layers","spatial_resolution"
    ],
    [SearchUIConfig.search.searchFilters.filters]
  );
  console.log(
    "generateFilterFromCurrentResults",
    generateFilterFromCurrentResults
  );
  const minRange = generateFilterFromCurrentResults["index_year"]
    ? generateFilterFromCurrentResults["index_year"]
        .map(Number)
        .reduce((a, b) => (a < b ? a : b))
    : 1900;
  const maxRange = generateFilterFromCurrentResults["index_year"]
    ? generateFilterFromCurrentResults["index_year"]
        .map(Number)
        .reduce((a, b) => (a > b ? a : b))
    : 2024;
  const [yearRange, setYearRange] = useState([1900, 2024]);
  const [marks, setMarks] = useState([]);
  const [filterQueries, setFilterQueries] = useState(props.filterQueries);
  const getYearRangeFromUrl = (indexYearString) => {
    const yearsArray = indexYearString.split(",").map(Number);
    const minYear = Math.min(...yearsArray);
    const maxYear = Math.max(...yearsArray);
    setMarks([
      { value: minYear, label: `${minYear}` },
      { value: maxYear, label: `${maxYear}` },
    ]);
    return [minYear, maxYear];
  };
  useEffect(() => {
    let indexYearString = [];
    filterQueries.forEach((f) => {
      if (f.attribute === "index_year") indexYearString.push(f.value);
    });
    if (indexYearString.length > 0) {
      setYearRange(getYearRangeFromUrl(indexYearString.join(",")));
    }
  }, [props.originalList, props.filterQueries]);
  const handleYearRangeChange = (event, newValue) => {
    setYearRange(newValue);
    // const newFilterQueries = props.filterQueries.filter(
    //   (f) => f["attribute"] !== "index_year"
    // );
    // 
    const newFilterQueries = props.filterQueries.filter(
      (f) => f["attribute"] !== "index_year"
    ).filter((f) => f["attribute"] !== "subject");
    console.log("newFilterQueries", newFilterQueries);
    const yearsArray = Array.from(
      { length: newValue[1] - newValue[0] + 1 },
      (_, i) => newValue[0] + i
    );
    // ultimately, the index_year attribute should be set to null if the slider is at its
    // min/max range. This would remove the URL param, thereby removing this facet from the solr
    // query. Tried to implement this here but got a strange behavior...

    const yearsString =
      newValue[0] === minRange && newValue[1] === maxRange
        ? null
        : yearsArray.join(",");
    if (yearsString !== null) {
      newFilterQueries.push({
        attribute: "index_year",
        value: yearsString,
      });
    }
    // newFilterQueries.push({
    //   attribute: "index_year",
    //   // value: yearsString,
    //   value: yearsArray.join(","),
    // });
    updateAll(
      params,
      props.sortBy,
      props.sortOrder,
      newFilterQueries,
      props.term
    );
    setFilterQueries(newFilterQueries);
  };
  // Initialize filter states outside of useMemo
  const filterStates = filterAttributes.map((filter) => {
    return useQueryState(filter, parseAsString.withDefault(""));
  });

  const existingFilters = useMemo(() => {
    return filterAttributes
      .map((filter, index) => {
        const [queryState] = filterStates[index];
        return queryState.length > 0
          ? {
              filter,
              value: queryState,
            }
          : null;
      })
      .filter(
        (item): item is { filter: string; value: string } => item !== null
      );
  }, [filterAttributes, filterStates]);

  return (
    <div
      className={`pr-5 ${classes.filterPanel}`}
      style={{
        flex: "1 1 auto",
        overflow: "hidden",
      }}
    >
      <Box
        className="p-5"
        sx={{
          background: `${fullConfig.theme.colors["lightbisque"]}`,
          borderRadius: "4px",
        }}
      >
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <div className="text-s font-bold">Sort</div>
          </Box>
          <Box>
            <IconButton
              sx={{
                color: `${fullConfig.theme.colors["frenchviolet"]}`,
                padding: 0,
              }}
              onClick={() => {
                if (props.showFilter.length > 0) {
                  props.setShowFilter(null);
                } else {
                  props.setShowFilter("on");
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {/* Sort by modified date */}
        <Box display="flex" alignItems="center">
          <Box>
            <span>
              <Button
                variant="text"
                sx={{
                  textTransform: "none",
                  color: `${fullConfig.theme.colors["frenchviolet"]}`,
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 700,
                  textDecoration: `${
                    props.sortBy === "modified" && props.sortOrder === "desc"
                      ? "underline"
                      : "none"
                  }`,
                }}
                onClick={(e) => {
                  // sort by modified date asc by updating sortOrder and sortBy in url
                  updateAll(
                    params,
                    "modified",
                    "desc",
                    props.filterQueries,
                    props.term
                  );
                }}
              >
                Recent first
              </Button>{" "}
              |{" "}
              <Button
                variant="text"
                sx={{
                  textTransform: "none",
                  color: `${fullConfig.theme.colors["frenchviolet"]}`,
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 700,
                  textDecoration: `${
                    props.sortBy === "modified" && props.sortOrder === "asc"
                      ? "underline"
                      : "none"
                  }`,
                }}
                onClick={(e) => {
                  updateAll(
                    params,
                    "modified",
                    "asc",
                    props.filterQueries,
                    props.term
                  );
                }}
              >
                Oldest first
              </Button>{" "}
              |{" "}
              <Button
                variant="text"
                sx={{
                  textTransform: "none",
                  color: `${fullConfig.theme.colors["frenchviolet"]}`,
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 700,
                  textDecoration: `${
                    !props.sortBy && !props.sortOrder ? "underline" : "none"
                  }`,
                }}
                onClick={(e) => {
                  // sort by relevance asc (i.e. the default order)
                  updateAll(params, "", "", props.filterQueries, props.term);
                }}
              >
                Relevance
              </Button>
            </span>
          </Box>
        </Box>
        {Object.keys(generateFilterFromCurrentResults).length > 0 &&
          Object.keys(generateFilterFromCurrentResults).map((filterAttr) => {
            return (
              <div key={filterAttr}>
                <div className="text-s font-bold">
                  {filterNameLookup[filterAttr]}
                </div>
                {filterAttr === "index_year" ? (
                  <Slider
                    sx={{
                      color: `${fullConfig.theme.colors["frenchviolet"]}`,
                      "& .MuiSlider-markLabel": labelStyle,
                      "& .MuiSlider-valueLabel": labelStyle,
                      width: "calc(100% - 22px)",
                      marginLeft: "11px",
                    }}
                    min={minRange}
                    max={maxRange}
                    value={yearRange}
                    onChange={handleYearRangeChange}
                    valueLabelDisplay="auto"
                    marks={marks}
                  />
                ) : (
                  <FormGroup
                    sx={{
                      overflowY: "auto",
                      maxHeight: `${props.optionMaxNum * 20}px`,
                    }}
                  >
                    {Array.from(
                      {
                        length:
                          generateFilterFromCurrentResults[filterAttr].length,
                      },
                      (_, i) => (
                        <FormControlLabel
                          sx={{
                            "& .MuiFormControlLabel-label": labelStyle,
                          }}
                          control={
                            <Checkbox
                              sx={checkBoxStyle}
                              checked={
                                existingFilters.find((e) => {
                                  const substrings = e.value
                                    .toLowerCase()
                                    .split(",");
                                  const matchAny = substrings.some(
                                    (substring) =>
                                      e.filter === filterAttr &&
                                      generateFilterFromCurrentResults[
                                        filterAttr
                                      ]
                                        .map((str) => str.toLowerCase())
                                        [i].includes(substring.trim())
                                  );
                                  return matchAny;
                                }) !== undefined
                              }
                              value={
                                generateFilterFromCurrentResults[filterAttr][i]
                              }
                              onChange={(event) => {
                                // create new FilterQueries
                                let newFilterQueries = [];
                                if (event.target.checked) {
                                  props.filterQueries.find(
                                    (f) =>
                                      f[filterAttr] ===
                                      generateFilterFromCurrentResults[
                                        filterAttr
                                      ][i]
                                  ) === undefined
                                    ? props.filterQueries.push({
                                        attribute: filterAttr,
                                        value:
                                          generateFilterFromCurrentResults[
                                            filterAttr
                                          ][i],
                                      })
                                    : (props.filterQueries.find(
                                        (f) => f["attribute"] === filterAttr
                                      )["value"] =
                                        generateFilterFromCurrentResults[
                                          filterAttr
                                        ][i]);
                                  newFilterQueries = props.filterQueries;
                                } else {
                                  //remove this item from filterQueries
                                  newFilterQueries = props.filterQueries.filter(
                                    (f) =>
                                      f["value"] !==
                                      generateFilterFromCurrentResults[
                                        filterAttr
                                      ][i]
                                  );
                                }
                                updateAll(
                                  params,
                                  props.sortBy,
                                  props.sortOrder,
                                  newFilterQueries,
                                  props.term
                                );
                              }}
                            />
                          }
                          label={
                            generateFilterFromCurrentResults[filterAttr][i]
                          }
                          key={i}
                        />
                      )
                    )}
                  </FormGroup>
                )}
              </div>
            );
          })}
      </Box>
    </div>
  );
};

export default FilterPanel;

/**
 * Helper Functions
 */
export const grouped = (objects) => {
  const acc = objects.reduce((acc, obj) => {
    if (!acc[obj.attribute]) {
      acc[obj.attribute] = { attribute: obj.attribute, value: obj.value };
    } else {
      acc[obj.attribute].value = `${acc[obj.attribute].value},${obj.value}`;
    }
    return acc;
  }, {});
  return Object.values(acc);
};
