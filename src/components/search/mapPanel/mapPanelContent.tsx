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
  Popover,
  SvgIcon,
} from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Info as InfoOutlinedIcon,
  Check as CheckIcon,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
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

const DynamicMapArea = dynamic(() => import("../../map/mapArea"), {
  ssr: false,
});

const MapPanelContent = (props: Props): JSX.Element => {
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
        ? `Overlays: ${visOverlays.join(", ")}`
        : "Overlays"
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
            <SvgIcon
              component={ArrowDropDownIcon}
              sx={{
                color: fullConfig.theme.colors["frenchviolet"],
                fontSize: 40,
              }}
            />
            {overlaysBtnTxt}
          </Button>
          <Box component="span" className="mx-2">
            <a
              onClick={() => {
                dispatch(setShowInfoPanel(true));
                dispatch(setInfoPanelTab(4))
              }}
              style={{ cursor: "pointer" }}
              className="no-underline text-frenchviolet"
            >
              <InfoOutlinedIcon />
            </a>
          </Box>
          <Menu
            id="basic-menu"
            className="flex items-center sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em]"
            style={{
              boxShadow: "#aaaaaa 6px 12px 16px -8px",
            }}
            anchorEl={overlaysMenuAnchorEl}
            open={overlaysOpen}
            onClose={closeOverlaysMenu}
            MenuListProps={{
              "aria-labelledby": "overlays-button",
              className: "rounded bg-lightbisque",
            }}
          >
            {Object.keys(overlayRegistry).map((overlay) => (
              <MenuItem key={overlay} onClick={() => toggleOverlay(overlay)}>
                {visOverlays.includes(overlay) && (
                  <ListItemIcon>
                    <CheckIcon />
                  </ListItemIcon>
                )}
                {overlay}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Box>
      <Box
        height="100%"
        sx={{
          overflowY: "scroll",
          height: `${SearchUIConfig.search.searchResults.resultListHeight}`,
        }}
      >
        <DynamicMapArea/>
      </Box>
      <Box className="sm:my-[1.68em]">
        <div className="sm:mb-[1.5em] sm:flex-col">
          <Box height="100%" className="sm:mt-[4.35em] sm:ml-[2em]">
            <Box className="text-2xl sm:mb-[0.6em]">
              How to search for data...
            </Box>
            <Box className="text-s sm:mb-[1.5em]">
              <p className="mb-[1em]">
                Users have the option to refine their search by first selecting
                a geographic scale, such as state, county, or census tract, as
                an initial filter. This allows them to narrow down the scope of
                their query to a specific level of spatial detail. After
                applying this geographic filter, they can then enter keywords of
                interest to search within the filtered results.
              </p>
              <p>
                However, this two-step process is not mandatory. Users also have
                the flexibility to bypass the spatial resolution filter entirely
                and conduct their search directly. They can simply enter their
                keywords or search terms into the main search bar, which will
                query the entire database without any predetermined geographic
                constraints.
              </p>
            </Box>
            <Box display="flex" flexDirection="row" gap={3}>
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
            </Box>
          </Box>
        </div>
      </Box>
    </Grid>
  );
};

export default MapPanelContent;
