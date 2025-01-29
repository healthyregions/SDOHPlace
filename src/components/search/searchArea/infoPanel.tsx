import * as React from "react";
import { makeStyles } from "@mui/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { Box, Tabs, Tab, IconButton, Typography, List, ListItem, Divider, Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setShowInfoPanel, setInfoPanelTab } from "@/store/slices/uiSlice";

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
      {value === index && <Box sx={{ py: 3 }}>
        <Box sx={{height:"200px", overflowY:"auto"}}>
        {children}
        </Box>
        <Divider sx={{py:1}}/>
        {value != 0 && (
          <a
            onClick={() => {
              dispatch(setInfoPanelTab(value-1));
            }}
            style={{ cursor: "pointer" }}
            className="no-underline text-frenchviolet"
          >
            &larr; Previous&nbsp;&nbsp;
          </a>
        )}
        {value != 3 && (
          <a
            onClick={() => {
              dispatch(setInfoPanelTab(value+1));
            }}
            style={{ cursor: "pointer" }}
            className="no-underline text-frenchviolet"
          >
            Next &rarr;
          </a>
        )}
      </Box>}
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
  const handleClosePanel = () => {
    dispatch(setShowInfoPanel(false));
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
        >
          <Tab
            sx={{ paddingRight: "1em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    infoPanelTab === 0
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Getting started
              </Typography>
            }
            wrapped
            {...a11yProps(0)}
          />
          <Tab
            sx={{ paddingRight: "1em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    infoPanelTab === 1
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Making queries
              </Typography>
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={{ paddingRight: "1em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    infoPanelTab === 2
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Geography filters
              </Typography>
            }
            {...a11yProps(2)}
          />
          <Tab
            sx={{ paddingRight: "1em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    infoPanelTab === 3
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Map overlays
              </Typography>
            }
            {...a11yProps(3)}
          />
        </Tabs>

        <IconButton
          onClick={handleClosePanel}
          style={{
            position: "absolute",
            right: 0,
            top: 4,
            color: fullConfig.theme.colors["frenchviolet"],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          transition: "left 0.3s linear",
        }}
        ref={tabPanelRef}
      >
        <CustomTabPanel value={infoPanelTab} index={0}>
        You can begin your search by first selecting a geographic scale&mdash;such as state, county, or census tract&mdash;as an initial filter. This allows you to narrow down the scope of your query to a specific level of spatial detail. After applying this geographic filter, you can enter keywords of interest to search within the filtered results. 
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={1}>
          If you know the general SDOH topic you are interested in finding data
          for, first try the themes in the <strong>Sort & Filter</strong> panel
          at left. Not finding the theme you want? Try typing it into the main search
          bar to see if it appears in the auto-suggest dropdown, or just click
          &rarr; and see what you find!
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={2}>
          Some sources provide data at the state level, while others may provide data at smaller resolutions
          like county or tract level. The interface makes it easy to filter by this geography level, or &quot;spatial resolution&quot;,
          allowing you to find only data relevant for your work.
          <List>
            <ListItem>State (largest, most general level)</ListItem>
            <ListItem>County (subdivision of a state)</ListItem>
            <ListItem>Census Tract (smaller geographical unit),</ListItem>
            <ListItem>Block Group (smallest unit, a subdivision of census tract)</ListItem>
            <ListItem>ZIP Code Tabulation Area (ZCTA)</ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={3}>
          We provide a few map overlay layers that can be used as reference data during your search.
          <List>
            <ListItem>Parks (<Link href="https://overturemaps.org/">Overture Maps foundation</Link>)</ListItem>
          </List>
        </CustomTabPanel>
      </Box>
    </div>
  );
}
