import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SpatialResolutionCheck from "./spatialResolutionCheck";
import SearchBox from "./searchBox";
import { Box, Grid, Typography } from "@mui/material";
import { SearchUIConfig } from "@/components/searchUIConfig";
import GlossaryPopover from "@/components/GlossaryPopover";
import { GetAllParams } from "../helper/ParameterList";
import InfoPanel from "./infoPanel";

interface Props {
  header: string;
  description: string;
  schema: any;
  autocompleteKey: number;
  options: any[];
  handleInputReset: () => void;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (params: any, value: string, filterQueries: any) => void;
  filterQueries: any;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  searchRow: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
  },
}));
const SearchRow = (props: Props): JSX.Element => {
  const classes = useStyles();
  let params = GetAllParams();
  return (
    // The mt for top nav is 8, therefore set the row mt to 32
    <Box className="w-full mt-8 sm:mt-32 max-md:max-w-full shadow-none aspect-ratio bg-lightviolet">
      <Grid container className="sm:mb-7">
        <Grid
          item
          xs={12}
          sm={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          className="pt-[2em] px-[2em]"
        >
          <Box display="flex" flexDirection="column" width="100%">
            <div className="text-[3em] sm:text-[3.5em] xl:text-[4em] text-center sm:text-left">
              {props.header}
            </div>
            <div className={`text-s text-center sm:text-left sm:mt-[1em]`}>
              Our data discovery platform provides access to spatially indexed
              and curated databases, specifically designed for conducting{" "}
              <GlossaryPopover entry={"health equity"} /> research.
            </div>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          order={{ xs: 1, sm: 0 }}
          className={`pt-[2.1825em] pb-[2.875em] ${classes.searchRow}`}
        >
          {!params.showInfoPanel && (
            <Box width="100%">
              <Box width="100%">
                <SpatialResolutionCheck
                  src={SearchUIConfig.search.searchBox.spatialResOptions}
                  handleSearch={props.handleSearch}
                  filterQueries={props.filterQueries}
                />
              </Box>
              <Box
                width="100%"
                className="mt-[2em] sm:mt-0 3xl:max-w-[1203px] pr-[1em] md:pr-[3.375em]"
              >
                <SearchBox
                  schema={props.schema}
                  autocompleteKey={props.autocompleteKey}
                  options={props.options}
                  setOptions={props.setOptions}
                  handleInputReset={props.handleInputReset}
                  inputValue={props.inputValue}
                  setInputValue={props.setInputValue}
                  value={props.value}
                  setValue={props.setValue}
                  inputRef={props.inputRef}
                  handleSearch={props.handleSearch}
                  setQuery={props.setQuery}
                />
              </Box>
            </Box>
          )}
          {params.showInfoPanel && (
            <div>
              <div
                className={`flex items-center space-x-10 md:ml-[6em] md:mr-[5.3125em]`}
              >
                <InfoPanel />
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchRow;
