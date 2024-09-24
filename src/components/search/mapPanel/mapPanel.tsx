import { makeStyles } from "@mui/styles";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  use,
  MouseEvent,
} from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "meta/interface/SolrObject";
import MapArea from "@/components/map/mapArea";
import { SearchUIConfig } from "@/components/searchUIConfig";
import {
  Box,
  IconButton,
  SvgIcon,
  Popover,
  Typography,
  ListItemIcon,
  Grid,
} from "@mui/material";
import { styled } from "@mui/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import ConstructionIcon from "@mui/icons-material/Construction";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { GetAllParams } from "../helper/ParameterList";
import { overlayRegistry } from "../../map/helper/layers";

interface Props {
  resultsList: SolrObject[];
  highlightLyr?: string;
  highlightIds?: string[];
  showMap: string;
}
const fullConfig = resolveConfig(tailwindConfig);

const OverlaysButton = styled(Button)({
  margin: 0,
  marginRight: "10px",
  padding: 0,
  textTransform: "none",
  color: fullConfig.theme.colors["frenchviolet"],
  fontWeight: 400,
  fontSize: "1.1em",
});

const MapPanel = (props: Props): JSX.Element => {
  const params = GetAllParams();
  const [overlaysMenuAnchorEl, setOverlaysMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [overlaysBtnTxt, setOverlaysBtnTxt] = useState("Overlays");
  const overlaysOpen = Boolean(overlaysMenuAnchorEl);

  const handleOverlaysClick = (event: MouseEvent<HTMLButtonElement>) => {
    setOverlaysMenuAnchorEl(event.currentTarget);
  };
  const closeOverlaysMenu = () => {
    setOverlaysMenuAnchorEl(null);
  };
  function toggleOverlay(overlay) {
    let newOverlays = params.visOverlays;
    newOverlays.includes(overlay)
      ? (newOverlays = newOverlays.filter((e) => e !== overlay))
      : newOverlays.push(overlay);
    params.setVisOverlays(newOverlays);
  }

  const [infoAnchorEl, setInfoAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const infoOpen = Boolean(infoAnchorEl);
  const handleInfoClick = (event: MouseEvent<HTMLButtonElement>) => {
    setInfoAnchorEl(event.currentTarget);
  };

  const handleInfoClose = () => {
    setInfoAnchorEl(null);
  };
  const popoverId = infoOpen ? "simple-popover" : undefined;
  useEffect(() => {
    params.visOverlays.length > 0
      ? setOverlaysBtnTxt("Overlays: " + params.visOverlays.join(", "))
      : setOverlaysBtnTxt("Overlays");
  });
  return (
    <Grid item className="sm:px-[2em]" xs={12} display={props.showMap}>
      <Box>
        <div className="flex flex-col sm:mb-[1.5em] sm:ml-[1.1em] sm:flex-row items-center">
          <div className="flex flex-col sm:flex-row flex-grow text-2xl">
            Map view
          </div>
          <OverlaysButton
            id="overlays-button"
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
          </OverlaysButton>
          <Button
            id="basic-button"
            className={`flex items-center sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em]`}
            style={{ color: fullConfig.theme.colors["frenchviolet"] }}
            aria-controls={infoOpen ? "info-popover" : undefined}
            aria-haspopup="true"
            aria-expanded={infoOpen ? "true" : undefined}
            onClick={handleInfoClick}
          >
            <SvgIcon
              component={InfoOutlinedIcon}
              sx={{
                color: fullConfig.theme.colors["frenchviolet"],
              }}
            />
          </Button>
          <Popover
            id={popoverId}
            open={infoOpen}
            anchorEl={infoAnchorEl}
            onClose={handleInfoClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <p style={{ padding: "1em" }}>
              Overlays created from{" "}
              <Link
                href="https://docs.overturemaps.org/guides/places/"
                target="_blank"
              >
                Places
              </Link>{" "}
              theme,{" "}
              <Link href="https://overturemaps.org" target="_blank">
                Overture Maps Foundation
              </Link>
              .
            </p>
          </Popover>
          <Menu
            id="basic-menu"
            className={`flex items-center sm:justify-end mt-0 order-1 sm:order-none flex-none text-l-500 sm:mr-[2.3em]`}
            style={{ color: fullConfig.theme.colors["frenchviolet"] }}
            anchorEl={overlaysMenuAnchorEl}
            open={overlaysOpen}
            onClose={closeOverlaysMenu}
            MenuListProps={{
              "aria-labelledby": "overlays-button",
            }}
          >
            {Object.keys(overlayRegistry).map((overlay) => (
              <MenuItem
                // selected={params.visOverlays.includes(overlay)}
                style={{ color: fullConfig.theme.colors["frenchviolet"] }}
                key={overlay}
                onClick={() => {
                  closeOverlaysMenu();
                  toggleOverlay(overlay);
                }}
              >
                {params.visOverlays.includes(overlay) && (
                  <ListItemIcon
                    style={{ color: fullConfig.theme.colors["frenchviolet"] }}
                  >
                    <CheckIcon />
                  </ListItemIcon>
                )}
                {overlay}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Box>
      <div></div>
      <Box
        height={"100%"}
        sx={{
          overflowY: "scroll",
          height: `${SearchUIConfig.search.searchResults.resultListHeight}`,
        }}
      >
        <MapArea
          searchResult={props.resultsList}
          highlightIds={props.highlightIds}
          highlightLyr={props.highlightLyr}
        />
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
    </Grid>
  );
};
export default MapPanel;
