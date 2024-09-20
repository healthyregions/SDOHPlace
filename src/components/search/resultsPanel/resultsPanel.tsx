import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchIcon from "@mui/icons-material/Search";
import { SolrObject } from "meta/interface/SolrObject";
import ResultCard from "./resultCard";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SvgIcon } from "@mui/material";
import { SearchUIConfig } from "@/components/searchUIConfig";
import IconTag from "../detailPanel/iconTag";
import IconMatch from "../helper/IconMatch";
import {
  GetAllParams,
  isFiltersOn,
  resetAllFilters,
} from "../helper/ParameterList";

interface Props {
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
                {props.isQuery ? "Results" : "All data sources"} (
                {props.resultsList.length})
              </Box>
            </div>
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
          {isFiltersOn(params) && (
            <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center justify-center">
              <Button
                className="sm:my-[0.5em]"
                sx={{
                  color: "white",
                  backgroundColor: fullConfig.theme.colors["frenchviolet"],
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: fullConfig.theme.colors["frenchviolet"],
                    color: "white",
                  },
                }}
                onClick={() => {
                  resetAllFilters(params);
                  props.handleSearch(params, params.query, []);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </Box>
        {props.showFilter.length > 0 && props.filterComponent}
        <Box
          height={"100%"}
          sx={{
            overflowY: "scroll",
            paddingRight: "1.25em",
            marginTop: "1.5em",
            maxHeight: `${
              props.isQuery || props.showFilter.length > 0
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
                <IconTag
                  svgIcon={IconMatch("Demographics")}
                  label="Demographics"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Economic Stability")}
                  label="Economic Stability"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Employment")}
                  label="Employment"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Education")}
                  label="Education"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Food Environment")}
                  label="Food Environment"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Health and Healthcare")}
                  label="Health and Healthcare"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Housing")}
                  label="Housing"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Neighborhood and Built Environment")}
                  label="Neighborhood and Built Environment"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Physical Activity and Lifestyle")}
                  label="Physical Activity and Lifestyle"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Safety")}
                  label="Safety"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Social and Community Context")}
                  label="Social and Community Context"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
                <IconTag
                  svgIcon={IconMatch("Transportation and Infrastructure")}
                  label="Transportation and Infrastructure"
                  labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                  labelColor={fullConfig.theme.colors["almostblack"]}
                  roundBackground={true}
                  handleSearch={props.handleSearch}
                  handleInputReset={props.handleInputReset}
                />
              </Box>
            </div>
          )}
        </Box>
        <Box
          className="sm:my-[1.68em]"
          display={props.isQuery ? "block" : "none"}
        >
          <div className="sm:mb-[1.5em] sm:flex-col">
            <div className="flex flex-grow  sm:ml-[0.7em] items-center text-2xl">
              <span className="mr-4">Similar results</span>
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
              {/* Temporary use the first two result items until we decide what to put in the related section */}
              {props.relatedList.map((result, index) => (
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
      </span>
    </div>
  );
};
export default ResultsPanel;
