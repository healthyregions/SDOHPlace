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
    <>
      <Grid
        item
        xs={12}
        sm={4}
        display="flex"
        flexDirection="column"
        className="py-[2em] sm:px-[1.1em] xs:text-center sm:text-left"
      >
        <h2>{props.header}</h2>
        <div className={`text-s text-center sm:text-left sm:mt-[1em]`} style={{ textWrap: 'balance'}}>
          Our data discovery platform provides access to spatially indexed and
          curated databases, specifically designed for conducting{" "}
          <GlossaryPopover entry={"health equity"} /> research.
        </div>
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
        className={`py-[2em] px-8 ${classes.searchRow}`}
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
            <Box width="100%" className="mt-[2em] sm:mt-0">
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
    </>
  );
};
export default SearchRow;
