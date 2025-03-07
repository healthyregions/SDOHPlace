"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  SvgIcon,
  MenuList,
} from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  InfoOutlined as InfoOutlinedIcon,
  Check as CheckIcon,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config";
import { SolrObject } from "meta/interface/SolrObject";
import { SearchUIConfig } from "@/components/searchUIConfig";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import { AppDispatch, RootState } from "@/store";
import { setSchema, setVisOverlays } from "@/store/slices/searchSlice";
import { overlayRegistry } from "../../map/helper/layers";
import { localStyles } from "../../../lib/localStyles";
import dynamic from "next/dynamic";
import { setShowInfoPanel, setInfoPanelTab } from "@/store/slices/uiSlice";

interface Props {
  resultsList: SolrObject[];
  showMap: string;
  schema: any;
}

const fullConfig = resolveConfig(tailwindConfig);

const useStyles = makeStyles((theme) => ({
  aiModeButton: {
    color: fullConfig.theme.colors["frenchviolet"],
    "&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color: "white",
    },
    "&:hover": {
      color: fullConfig.theme.colors["frenchviolet"],
    },
    "&:hover&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color:"white"
    }
  },
}))

const DynamicMapArea = dynamic(() => import("../../map/mapArea"), {
  ssr: false,
});

const MapPanelContent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const visOverlays = useSelector(
    (state: RootState) => state.search.visOverlays
  );
  const [overlaysMenuAnchorEl, setOverlaysMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [overlaysBtnTxt, setOverlaysBtnTxt] = useState("Overlays");
  const [infoAnchorEl, setInfoAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);
  const overlaysOpen = Boolean(overlaysMenuAnchorEl);
  const infoOpen = Boolean(infoAnchorEl);

  useEffect(() => {
    setIsMounted(true);
    dispatch(setSchema(props.schema));
  }, [dispatch]);
  useEffect(() => {
    if (isMounted) {
      dispatch(setVisOverlays(visOverlays));
    }
  }, [dispatch, visOverlays, isMounted]);
  useEffect(() => {
    setOverlaysBtnTxt(
      visOverlays.length > 0
        ? `Community Assets: ${visOverlays.slice(0,3).join(", ")}${visOverlays.length > 3 ? "..." : ""}`
        : "Community Assets"
    );
  }, [visOverlays]);

  const handleOverlaysClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOverlaysMenuAnchorEl(event.currentTarget);
  };
  const closeOverlaysMenu = () => {
    setOverlaysMenuAnchorEl(null);
  };
  const toggleOverlay = (overlay: string) => {
    const newOverlays = visOverlays.includes(overlay)
      ? visOverlays.filter((e) => e !== overlay)
      : [...visOverlays, overlay];
    dispatch(setVisOverlays(newOverlays));
  };
  const handleInfoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setInfoAnchorEl(event.currentTarget);
  };
  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };

  return (
    <Grid item className="sm:px-[2em]" xs={12} display={props.showMap}>
      <Box>
        <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center">
          <div className="flex flex-col sm:flex-row flex-grow text-2xl">
            Map view
          </div>
          <Button
            id="overlays-button"
            sx={localStyles.overlaysButton}
            aria-controls={overlaysOpen ? "overlays-button" : undefined}
            aria-haspopup="true"
            aria-expanded={overlaysOpen ? "true" : undefined}
            onClick={handleOverlaysClick}
          >
            {overlaysBtnTxt}
            <SvgIcon
              component={ArrowDropDownIcon}
              sx={{
                color: fullConfig.theme.colors["frenchviolet"],
                fontSize: 40,
              }}
            />
          </Button>
          <Box component="span" className="mx-2">
            <IconButton
              sx={{
                color: fullConfig.theme.colors["frenchviolet"],
              }}
              className={classes.aiModeButton}
              onClick={() => {
                dispatch(setShowInfoPanel(true));
                dispatch(setInfoPanelTab(5))
              }}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Box>
          <Menu
            id="basic-menu"
            className="flex items-center sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[5em]"
            style={{
              margin: 0,
              boxShadow: "#aaaaaa 6px 12px 16px -8px",
            }}
            anchorEl={overlaysMenuAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={overlaysOpen}
            onClose={closeOverlaysMenu}
            MenuListProps={{
              "aria-labelledby": "overlays-button",
              className: "rounded bg-lightbisque",
            }}
          >
            <MenuList>
            {Object.keys(overlayRegistry).map((overlay) => (
              <MenuItem key={overlay} onClick={() => toggleOverlay(overlay)} sx={{fontFamily:fullConfig.theme.fontFamily["sans"]}}>
                {visOverlays.includes(overlay) && (
                  <ListItemIcon>
                    <CheckIcon />
                  </ListItemIcon>
                )}
                {overlay}
              </MenuItem>
            ))}
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Box
        height="100%"
        sx={{
          height: `${SearchUIConfig.search.searchResults.resultListHeight}`,
        }}
      >
        <DynamicMapArea/>
      </Box>
      <Box className="sm:my-[1.68em]">
        <div className="sm:mb-[1.5em] sm:flex-col">
          <Box height="100%" className="sm:mt-[2em] sm:ml-[1.1em]">
            <Box className="text-2xl sm:mb-[0.6em]">
              Want to learn more about SDOH data?
            </Box>
            <Box className="text-s sm:mb-[1.5em]">
              <p className="mb-[1em]">
                We have a selection of resource guides available for different SDOH topics, like {" "}
                <Link href="/guides/greenspace-access">Greenspace Access</Link> and {" "}<Link href="/guides/transportation-equity">Transportation Equity</Link>.
                More guides are in the works! If you would like to collaborate on a research guide, please {" "}<Link href="/contact">get in touch</Link>.
              </p>
            </Box>
            <Box className="text-2xl sm:mb-[0.6em]">
              Unsure how to use SDOH data?
            </Box>
            <Box className="text-s sm:mb-[1.5em]">
              <p className="mb-[1em]">
                Checkout our <Link href="https://toolkit.sdohplace.org">Community Toolkit</Link> for walkthroughs and examples of how you can use datasets
                you find in this discovery application in your own research and web applications.
              </p>
            </Box>
            {/* <Box display="flex" flexDirection="row" gap={3}>
              <ButtonWithIcon
                label="What is SDOH and Place?"
                labelColor="frenchviolet"
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
                labelColor="frenchviolet"
                borderRadius="100px"
                noHover={true}
                noBox={true}
                fillColor="white"
                border={`1px solid ${fullConfig.theme.colors["frenchviolet"]}`}
                onClick={() =>
                  window.open("https://toolkit.sdohplace.org", "_blank")
                }
              />
            </Box> */}
          </Box>
        </div>
      </Box>
    </Grid>
  );
};

export default MapPanelContent;
