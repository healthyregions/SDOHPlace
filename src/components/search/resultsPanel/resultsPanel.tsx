import { makeStyles, propsToClassKey } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { SolrObject } from "meta/interface/SolrObject";
import ResultCard from "./resultCard";
import { Box, Button, CircularProgress } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SvgIcon } from "@mui/material";
import { SearchUIConfig } from "@/components/searchUIConfig";
import {
  GetAllParams,
  isFiltersOn,
  resetAllFilters,
} from "../helper/ParameterList";
import ThemeIcons from "../helper/themeIcons";

interface Props {
  isLoading: boolean;
  updateKey: number;
  resultsList: SolrObject[];
  relatedList: SolrObject[];
  isQuery: boolean;
  filterComponent: React.ReactNode;
  showFilter: string;
  setShowFilter: (value: string) => void;
  setHighlightLyr: (value: string) => void;
  setHighlightIds: (value: string[]) => void;
  handleSearch(params: any, value: string, filterQueries: any): void;
  handleInputReset: () => void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  resultsPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
  },
}));

const ResultsPanel = (props: Props): JSX.Element => {
  const classes = useStyles();
  const params = GetAllParams();
  //remove the duplicate results in the related list
  const uniqueRelatedList = React.useMemo(() => {
    return props.relatedList
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      .filter((v) => props.resultsList.every((t) => t.id !== v.id));
  }, [props.relatedList, props.resultsList]);

  return (
    <div
      className="results-panel"
      style={{ flex: "1 1 auto", overflow: "hidden" }}
    >
      <span className={`${classes.resultsPanel}`}>
        <Box>
          <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center">
            <div className="flex flex-col sm:flex-row flex-grow text-2xl">
              <Box>
                {props.isQuery && !props.isLoading
                  ? `Results (${props.resultsList.length})`
                  : `All Data Sources (${props.resultsList.length})`}
              </Box>
            </div>
            {isFiltersOn(params) && (
              <div className="flex flex-col sm:flex-row items-enter justify-center mr-4 cursor-pointer text-uppercase">
                <div
                  style={{
                    color: fullConfig.theme.colors["frenchviolet"]
                  }}
                  onClick={() => {
                    resetAllFilters(params);
                    props.handleSearch(params, params.query, []);
                  }}
                >
                  Clear All
                </div>
              </div>
            )}
            <div
              className={`flex sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em]`}
              style={{
                color: fullConfig.theme.colors["frenchviolet"],
                cursor: "pointer",
              }}
              onClick={() => {
                if (props.showFilter.length > 0) {
                  props.setShowFilter(null);
                } else {
                  props.setShowFilter("on");
                }
              }}
            >
              <SvgIcon
                component={FilterAltIcon}
                sx={{
                  color: fullConfig.theme.colors["frenchviolet"],
                  marginRight: "0.25em",
                }}
              />
              <div>Sort & Filter</div>
            </div>
          </div>
        </Box>
        {props.showFilter.length > 0 && props.filterComponent}
        <Box
          height={"100%"}
          sx={{
            overflowY: "scroll",
            paddingRight: "1.25em",
            marginTop: "1.5em",
            maxHeight: `${
              (props.isQuery &&
                params.query !== "*" &&
                params.query.length > 0 &&
                uniqueRelatedList.length > 0) ||
              props.showFilter.length > 0
                ? SearchUIConfig.search.searchResults.resultListHeight
                : "100vh"
            }`,
          }}
        >
          {props.resultsList.length > 0 ? (
            props.resultsList.map((result) => (
              <div key={result.id} className="mb-[0.75em]">
                <ResultCard
                  key={result.id}
                  resultItem={result}
                  setHighlightIds={props.setHighlightIds}
                  setHighlightLyr={props.setHighlightLyr}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col sm:ml-[1.1em] sm:mb-[2.5em]">
              <Box className="flex flex-col justify-center items-center mb-[1.5em]">
                <SearchIcon className="text-strongorange mb-[0.15em]" />
                <div className="text-s">No results</div>
              </Box>
              <Box className="mb-[0.75em]">
                <div className="text-s">Search for themes instead?</div>
              </Box>
              <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
                <ThemeIcons handleSearch={props.handleSearch} variant={'alternate'} />
              </Box>
            </div>
          )}
        </Box>
        {props.isLoading ? (
          <Box
            className="sm:my-[1.68em]"
            display={props.isQuery ? "block" : "none"}
          >
            <div className="flex flex-grow  sm:ml-[0.7em] items-center text-2xl">
              <span className="mr-4">
                Looking for data you may interested in...
              </span>
              <CircularProgress
                size={24}
                sx={{
                  color: fullConfig.theme.colors["strongorange"],
                  animationDuration: "550ms",
                  marginLeft: "0.5em",
                }}
              />
            </div>
          </Box>
        ) : (
          uniqueRelatedList.length > 0 && (
            <Box
              className="sm:my-[1.68em]"
              display={props.isQuery ? "block" : "none"}
            >
              <div className="sm:mb-[1.5em] sm:flex-col">
                <div className="flex flex-grow  sm:ml-[0.7em] items-center text-2xl">
                  <span className="mr-4">You may be interested in...</span>
                  <div
                    className="flex-grow border-b-2 sm:mr-[2.3em]"
                    style={{
                      height: "1px",
                      border: `1px solid ${fullConfig.theme.colors["strongorange"]}`,
                    }}
                  />
                </div>
                <Box
                  height={"100%"}
                  className="sm:mt-[0.875em]"
                  sx={{
                    overflowY: "scroll",
                    paddingRight: "1em",
                    maxHeight: `${SearchUIConfig.search.searchResults.relatedListHeight}`,
                  }}
                >
                  {uniqueRelatedList.map((result) => (
                    <div key={result.id} className="mb-[0.75em]">
                      <ResultCard
                        key={result.id}
                        resultItem={result}
                        setHighlightIds={props.setHighlightIds}
                        setHighlightLyr={props.setHighlightLyr}
                      />
                    </div>
                  ))}
                </Box>
              </div>
            </Box>
          )
        )}
      </span>
    </div>
  );
};
export default ResultsPanel;
