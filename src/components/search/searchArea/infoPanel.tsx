import * as React from "react";
import { makeStyles } from "@mui/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  List,
  ListItem,
  Divider,
  Link,
} from "@mui/material";
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
const tabTitles = [
  "Getting started",
  "Search results",
  "Keyword searches",
  "Geography filters",
  "Map overlays",
];
function CustomTabPanel(props: Props) {
  const dispatch = useDispatch();
  const { children, value, index, ...other } = props;
  const handleClosePanel = () => {
    dispatch(setShowInfoPanel(false));
  };
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
              {/* <a
                  onClick={() => {
                    dispatch(setShowInfoPanel(false));
                  }}
                  style={{ cursor: "pointer" }}
                  className="no-underline text-frenchviolet"
                >
                  Hide
                </a> */}
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

        {/* <IconButton
          onClick={handleClosePanel}
          style={{
            position: "absolute",
            right: -35,
            top: 4,
            color: fullConfig.theme.colors["frenchviolet"],
          }}
        >
          <CloseIcon />
        </IconButton> */}
      </Box>
      <Box
        sx={{
          transition: "left 0.3s linear",
        }}
        ref={tabPanelRef}
      >
        <CustomTabPanel value={infoPanelTab} index={0}>
          Welcome to our data discovery application. Here are a few ways for you
          to get started:
          <List>
            <ListItem>
              Search by terms and keywords: Use the main search bar to search
              for a concept you are interested in. As you type, a dropdown will
              appear with suggestions pulled directly from the datasets
              themselves.
            </ListItem>
            <ListItem>
              Filter by geography: Are you looking only for county-level data?
              Use the &quot;County&quot; filter to only show datasets at that
              level.
            </ListItem>
            <ListItem>
              Filter by theme or year: Researching food access? Only want the
              latest data? Click the &quot;Sort & Filter&quot; button to narrow
              results by theme and date.
            </ListItem>
            <ListItem>
              Filter by location: Only looking for datasets that cover your
              state or city? Use the search box within the map to find a place
              and filter for datasets that geographically overlap it.
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={1}>
          Once you have performed a search or set a filter, you will get a list
          of the items matching your query. Each item will have a collection of
          metadata associated with it, as well as actions for further
          exploration:
          <List>
            <ListItem>
              Click &quot;Show on map&quot; to get a preview of what areas the
              dataset covers.
            </ListItem>
            <ListItem>
              Click &quot;Details&quot; to open the item details panel and learn
              more about the dataset.
            </ListItem>
            <ListItem>
              Click &quot;Access&quot; to leave the discovery app and head to
              the source location of this dataset, for download and further
              analysis. Note: we do not store any raw data in this system, we
              only help you find and link out to the source repositories.
            </ListItem>
            <ListItem>
              Click &quot;Share&quot; to acquire a shareable link you can send
              to colleagues, the URL will bring them right to the same record
              you are looking at.
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={2}>
          As you type search terms into the main search box, you will notice
          that suggestions appear below the input box. This suggestion list is
          pulled straight from the data itself (we have tried to index a lot of
          information about each record) but there may still be times that your
          search turns up no results. In this case, it never hurts to try
          another word for your topic, or even just go ahead with a theme filter
          and browse through all results.
          <List>
            <ListItem>
              Tip: If you have used the search bar to make your query, you will
              then be able to hover each result to learn more about why that
              item matched your query.
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={3}>
          Some sources provide data at the state level, while others may provide
          data at smaller resolutions like county or tract level. The interface
          makes it easy to filter by this geography level, or &quot;spatial
          resolution&quot;, allowing you to find only data relevant for your
          work.
          <List>
            <ListItem>State (largest, most general level)</ListItem>
            <ListItem>County (subdivision of a state)</ListItem>
            <ListItem>Census Tract (smaller geographical unit),</ListItem>
            <ListItem>
              Block Group (smallest unit, a subdivision of census tract)
            </ListItem>
            <ListItem>ZIP Code Tabulation Area (ZCTA)</ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={4}>
          We provide a few map overlay layers that can be used as reference data
          during your search.
          <List>
            <ListItem>
              Parks (
              <Link href="https://overturemaps.org/">
                Overture Maps foundation
              </Link>
              )
            </ListItem>
          </List>
          <em>
            This is a feature we hope to expand in the future. Please don&apos;t
            hesitate to <Link href="/contact">get in touch</Link> if you have
            ideas for more overlays you would like to see or contribute.
          </em>
        </CustomTabPanel>
      </Box>
    </div>
  );
}
