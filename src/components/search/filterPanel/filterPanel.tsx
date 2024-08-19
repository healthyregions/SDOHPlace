/* eslint-disable react-hooks/rules-of-hooks */
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Button, IconButton, SxProps, Theme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "meta/interface/SolrObject";
import { useEffect, useMemo } from "react";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { generateFilterList, updateFilter } from "../helper/FilterHelpMethods";

interface Props {
  reGetFilterQueries: (res: any) => void;
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
  handleSearch: (value: string) => void;
  updateAll: (
    newSortBy: any,
    newSortOrder: any,
    filterQueries: any,
    searchTerm: any
  ) => void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  filterPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
  },
}));

/**
 * Only show filter items in url
 * @param props
 * @returns
 */
const FilterPanel = (props: Props): JSX.Element => {
  const classes = useStyles();
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

  const filterAttributes = useMemo(
    () => SearchUIConfig.search.searchFilters.filters.map((d) => d.attribute),
    [SearchUIConfig.search.searchFilters.filters]
  );

  // Initialize filter states outside of useMemo
  const filterStates = filterAttributes.map((filter) => {
    return useQueryState(filter, parseAsString.withDefault(""));
  });

  const existingFilters = useMemo(() => {
    return filterAttributes
      .map((filter, index) => {
        const [queryState] = filterStates[index];
        return queryState.length > 0 ? { filter, value: queryState } : null;
      })
      .filter(
        (item): item is { filter: string; value: string } => item !== null
      );
  }, [filterAttributes, filterStates]);

  useEffect(() => {
    // const filters = generateFilterList(props.originalList);
    // setGenerateFilterFromCurrentResults(filters);
  }, [props.originalList]);

  /** get all current filter UI status (not the parameter) */
  const getCurrentFilterQueries = () => {
    const filterQueries = existingFilters.map((filter) => {
      return { [filter.filter]: filter.value };
    });
    return filterQueries;
  };

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
          minHeight: SearchUIConfig.search.searchFilters.filterPanelHeight,
        }}
      >
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <div className="text-s font-bold">Sort</div>
          </Box>
          <Box>
            <IconButton
              sx={{ color: `${fullConfig.theme.colors["frenchviolet"]}` }}
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
            <div className="text-s font-bold">(Modified)Year</div>
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
                  props.updateAll(
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
                  props.updateAll(
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
                  props.updateAll("", "", props.filterQueries, props.term);
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
                <div className="text-s font-bold">{filterAttr}</div>
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
                                    generateFilterFromCurrentResults[filterAttr]
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
                              props.updateAll(
                                props.sortBy,
                                props.sortOrder,
                                newFilterQueries,
                                props.term
                              );
                            }}
                          />
                        }
                        label={generateFilterFromCurrentResults[filterAttr][i]}
                        key={i}
                      />
                    )
                  )}
                </FormGroup>
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
