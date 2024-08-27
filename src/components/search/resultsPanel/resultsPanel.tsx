import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "meta/interface/SolrObject";
import ResultCard from "./resultCard";
import { Box, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SvgIcon } from "@mui/material";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { set } from "date-fns";

interface Props {
  resultsList: SolrObject[];
  relatedList: SolrObject[];
  isQuery: boolean;
  filterComponent: React.ReactNode;
  showFilter: string;
  setShowFilter: (value: string) => void;
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
          {props.resultsList.map((result) => (
            <div key={result.id} className="mb-[0.75em]">
              <ResultCard key={result.id} resultItem={result} />
            </div>
          ))}
        </Box>
        <Box
          className="sm:my-[1.68em]"
          display={props.isQuery ? "block" : "none"}
        >
          <div className="sm:mb-[1.5em] sm:flex-col">
            <div className="flex flex-grow  sm:ml-[1.1em] items-center text-2xl">
              <span className="mr-4">Related</span>
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
                  <ResultCard key={result.id} resultItem={result} />
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
