import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Box, Grid } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SearchUIConfig } from "@/components/searchUIConfig";
import GlossaryPopover from "@/components/GlossaryPopover";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import SearchBox from "./searchBox";
import InfoPanel from "./infoPanel";
import { RootState } from "@/store";
import SpatialResolutionCheck from "./spatialResolutionCheck";
import { setShowInfoPanel, setInfoPanelTab } from "@/store/slices/uiSlice";

interface Props {
  header: string;
  schema: any;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  searchArea: {
    color: fullConfig.theme.colors["almostblack"],
    fontFamily: fullConfig.theme.fontFamily["sans"],
  },
}));

const SearchArea = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { showInfoPanel } = useSelector((state: RootState) => state.ui);

  return (
    <>
      <Grid
        item
        xs={12}
        sm={6}
        display="flex"
        flexDirection="column"
        className="py-[2em] sm:px-[1.1em] xs:text-center sm:text-left"
      >
        <h2>{props.header}</h2>
        <div
          className="text-s text-center sm:text-left sm:mt-[1em]"
          style={{ textWrap: "balance" }}
        >
          This platform provides access to spatially indexed and curated
          databases, specifically designed for conducting health equity
          research.{" "}
          <a
            onClick={() => {
              dispatch(setShowInfoPanel(true));
              dispatch(setInfoPanelTab(0));
            }}
            style={{ cursor: "pointer" }}
            className="no-underline text-frenchviolet"
          >
            <strong>Get started &rarr;</strong>
          </a>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        order={{ xs: 1, sm: 0 }}
        className={`py-[2em] px-8 ${classes.searchArea}`}
      >
        {!showInfoPanel ? (
          <Box width="100%">
            <Box width="100%">
              <SpatialResolutionCheck
                src={SearchUIConfig.search.searchBox.spatialResOptions}
                schema={props.schema}
              />
            </Box>
            <Box width="100%" className="mt-[2em] sm:mt-0">
              <SearchBox schema={props.schema} />
            </Box>
          </Box>
        ) : (
          <div>
            <div className="flex items-center space-x-10">
              <InfoPanel />
            </div>
          </div>
        )}
      </Grid>
    </>
  );
};

export default SearchArea;
