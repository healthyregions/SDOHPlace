import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SpatialResolutionCheck from "./spatialResolutionCheck";
import SearchBox from "./searchBox";
import { Box, Grid, Typography } from "@mui/material";
import { SearchUIConfig } from "@/components/searchUIConfig";

interface Props {
  header: string;
  description: string;
  schema: any;
  line2Height: number;
  autocompleteKey: number;
  options: any[];
  handleReset: () => void;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (value) => void;
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
  return (
    <Box
      className="w-full max-md:max-w-full shadow-none aspect-ratio bg-lightviolet"
      sx={{ marginTop: `${props.line2Height + 10}px` }} // to eliminate the minor overlap
    >
      <Grid container className="sm:mb-7">
        <Grid
          item
          xs={12}
          sm={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          className="py-[2em] px-[2em] sm:pt-[3em] sm:pl-[2em]"
        >
          <Box width="100%">
            <SpatialResolutionCheck
              src={SearchUIConfig.search.searchBox.spatialResOptions}
            />
          </Box>
          <Box width="100%" className="mt-[2em] sm:mt-0 sm:mb-5xl">
            <SearchBox
              schema={props.schema}
              autocompleteKey={props.autocompleteKey}
              options={props.options}
              setOptions={props.setOptions}
              handleReset={props.handleReset}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              value={props.value}
              setValue={props.setValue}
              inputRef={props.inputRef}
              handleSearch={props.handleSearch}
            />
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
          className={`py-[1em] pb-[2em] sm:pt-[3em] sm:pl-[4em] ${classes.searchRow}`}
        >
          <Box display="flex" flexDirection="column" width="100%">
            <div className="text-4xl sm:text-[4em] text-center sm:text-left mb-auto">
              {props.header}
            </div>
            <div className={`text-s lg:pr-[20em] text-center sm:text-left`}>
              {props.description}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchRow;
