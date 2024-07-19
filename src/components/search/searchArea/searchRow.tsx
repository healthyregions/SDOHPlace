import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SpatialResolutionCheck from "./spatialResolutionCheck";
import SearchBox from "./searchBox";
import { Box, Grid, Typography } from "@mui/material";

interface Props {
  header: string;
  description: string;
  schema: any;
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
  return (
    <Box className={`w-full shadow-none aspect-ratio bg-lightviolet`}>
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
            <SpatialResolutionCheck src={spatialResOptions} />
          </Box>
          <Box width="100%" className="mt-[2em] sm:mt-0 sm:mb-5xl ">
            <SearchBox schema={props.schema} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          display="flex"
          flexDirection="column"
          justifyContent={{ xs: "center", sm: "flex-start" }}
          alignItems={{ xs: "center", sm: "flex-start" }}
          order={{ xs: 1, sm: 0 }}
          className={`py-[1em] pb-[2em] sm:pt-[3em] sm:pl-[4em] ${classes.searchRow}`}
        >
          <div className="text-3xl sm:text-4xl text-center sm:text-left">
            {props.header}
          </div>
          <div className="text-s lg:pr-[20em] text-center sm:text-left">
            {props.description}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchRow;
