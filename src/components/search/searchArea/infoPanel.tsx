import * as React from "react";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setShowInfoPanel, setInfoPanelTab } from "@/store/slices/uiSlice";
import { AiSearchText } from "./helpText/aiSearchText";
import { InfoHelpText } from "./helpText/infoHelpText";
import { KeywordSearchText } from "./helpText/keywordSearchText";
import { GeographyFilterText } from "./helpText/geographyFilterText";
import { SearchResultsText } from "./helpText/searchResultsText";
import { CommunityAssetsText } from "./helpText/communityAssetsText";
interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  infoPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
  },
}));
const tabTitles = [
  "Getting started",
  "Keyword search",
  "AI search (experimental)",
  "Geography filters",
  "Search results",
  "Community assets",
];
function CustomTabPanel(props: Props) {
  const dispatch = useDispatch();
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 1 }}>
          <Box sx={{ height: "200px", overflowY: "auto" }}>{children}</Box>
          <Divider sx={{ mb: 1 }} />
          <Box className={"flex flex-row justify-between"}>
            <Box>
              {value != 0 && (
                <a
                  onClick={() => {
                    dispatch(setInfoPanelTab(value - 1));
                  }}
                  style={{ cursor: "pointer" }}
                  className="no-underline text-frenchviolet"
                >
                  &larr; Previous&nbsp;&nbsp;
                </a>
              )}
              {value != tabTitles.length - 1 && (
                <a
                  onClick={() => {
                    dispatch(setInfoPanelTab(value + 1));
                  }}
                  style={{ cursor: "pointer" }}
                  className="no-underline text-frenchviolet"
                >
                  Next &rarr;
                </a>
              )}
            </Box>
            <Box>
              <IconButton
                onClick={() => {
                  dispatch(setShowInfoPanel(false));
                }}
                style={{
                  padding: 0,
                  color: fullConfig.theme.colors["frenchviolet"],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function InfoPanel() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { infoPanelTab } = useSelector((state: RootState) => state.ui);
  const tabPanelRef = React.useRef(null);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setInfoPanelTab(newValue));
  };
  return (
    <div className={`${classes.infoPanel}`}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tabs
          value={infoPanelTab}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: fullConfig.theme.colors["frenchviolet"],
              height: "0.2em",
            },
          }}
          scrollButtons
          variant="scrollable"
        >
          {tabTitles.map((title, index) => (
            <Tab
              key={index}
              sx={{ paddingRight: "1em" }}
              label={
                <Typography
                  sx={{
                    textTransform: "none",
                    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                    fontWeight: 500,
                    color:
                      infoPanelTab === index
                        ? fullConfig.theme.colors["frenchviolet"]
                        : fullConfig.theme.colors["almostblack"],
                  }}
                >
                  {title}
                </Typography>
              }
              wrapped
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          transition: "left 0.3s linear",
        }}
        ref={tabPanelRef}
      >
        <CustomTabPanel value={infoPanelTab} index={0}>
          <InfoHelpText />
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={1}>
          <KeywordSearchText />
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={2}>
          <AiSearchText />
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={3}>
          <GeographyFilterText />
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={4}>
          <SearchResultsText />
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={5}>
          <CommunityAssetsText />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
