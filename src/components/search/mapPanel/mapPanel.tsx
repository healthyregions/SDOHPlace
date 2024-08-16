import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "meta/interface/SolrObject";
import MapArea from "@/components/map/mapArea";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { Box, IconButton, SvgIcon } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import ConstructionIcon from "@mui/icons-material/Construction";

interface Props {
  resultsList: SolrObject[];
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  mapPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
  },
}));

const MapPanel = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <span className={`${classes.mapPanel}`}>
      <Box>
        <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center">
          <div className="flex flex-col sm:flex-row flex-grow text-2xl">
            Map view
          </div>
          <div
            className={`flex items-center sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em]`}
            style={{ color: fullConfig.theme.colors["frenchviolet"] }}
          >
            <SvgIcon
              component={ArrowDropDownIcon}
              sx={{
                color: fullConfig.theme.colors["frenchviolet"],
                fontSize: 40,
              }}
            />
            <span className="sm:mx-[0.25em]">Overlays:</span> <b>Parks</b>
          </div>
        </div>
      </Box>
      <Box
        height={"100%"}
        sx={{
          overflowY: "scroll",
          paddingRight: "1em",
          height: `${SearchUIConfig.search.searchResults.resultListHeight}`,
        }}
      >
        <MapArea searchResult={props.resultsList} />
      </Box>
      <Box className="sm:my-[1.68em]">
        <div className="sm:mb-[1.5em] sm:flex-col">
          <Box height={"100%"} className="sm:mt-[4.35em] sm:ml-[2em]">
            <Box className="text-2xl sm:mb-[0.6em]">
              {SearchUIConfig.search.mapPanel.title}
            </Box>
            <Box className="text-s sm:mb-[1.5em]">
              {SearchUIConfig.search.mapPanel.subtitle}
            </Box>
            <Box display={"flex"} flexDirection={"row"} gap={3}>
              <ButtonWithIcon
                label="What is SDOH and Place?"
                labelColor={"frenchviolet"}
                borderRadius="100px"
                noHover={true}
                noBox={true}
                border={`1px solid ${fullConfig.theme.colors["frenchviolet"]}`}
                fillColor="white"
                onClick={() => window.open("https://sdohplace.org", "_blank")}
              />
              <ButtonWithIcon
                muiIcon={ConstructionIcon}
                label="Community Toolkit"
                labelColor={"frenchviolet"}
                borderRadius="100px"
                noHover={true}
                noBox={true}
                fillColor="white"
                border={`1px solid ${fullConfig.theme.colors["frenchviolet"]}`}
                onClick={() =>
                  window.open("https://toolkit.sdohplace.org", "_blank")
                }
              />
            </Box>
          </Box>
        </div>
      </Box>
    </span>
  );
};
export default MapPanel;
