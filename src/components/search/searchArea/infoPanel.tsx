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
import { overlayRegistry } from "@/components/map/helper/layers";

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
          {/* Intro tab */}
          Welcome to our data discovery application. Here are a few ways for you
          to get started:
          <List>
            <ListItem><span>
            <strong>Search by terms:</strong> Use the main search bar to search
              for a concept you are interested in. As you type, a dropdown will
              appear with suggestions pulled directly from the datasets
              themselves.
              </span>
            </ListItem>
            <ListItem><span>
              <strong>Filter by geography:</strong> Are you looking only for county-level data?
              Use the &quot;County&quot; filter to only show datasets at that
              level.
            </span>
            </ListItem>
            <ListItem><span>
            <strong>Filter by theme or year:</strong> Researching food access? Only want the
              latest data? Click the &quot;Sort & Filter&quot; button to narrow
              results by theme and date.
              </span>
            </ListItem>
            <ListItem><span>
            <strong>Filter by location:</strong> Only looking for datasets that cover your
              state or city? Use the search box within the map to find a place
              and filter for datasets that geographically overlap it.
              </span>
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={1}>
          <Typography sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>
          As you type search terms into the main search box, you will notice
          that suggestions appear below the input box. This suggestion list is
          pulled straight from the data itself (we have tried to index a lot of
          information about each record) but there may still be times that your
          search turns up no results. In this case, it never hurts to try
          another word for your topic, or even just go ahead with a theme filter
          and browse through all results.
          </Typography>
          <List>
            <ListItem>
              Tip: If you have used the search bar to make your query, you will
              then be able to hover each result to learn more about why that
              item matched your query.
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={2}>
          {/* AI search tab */}
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>In addition to a standard keyword search, we also have an an experimental AI search mode that
          allows you to ask questions like <strong>Where is children&apos;s food access the most limited?</strong>{" "}
          But how does this work?</Typography>
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>
          When a question like this is submitted, we combine it with our
          {" "}<Link href="https://github.com/healthyregions/SDOHPlace/blob/discovery_app/config/prompt/prompt_message.js" target={"_blank"}>
          prepared prompt</Link> and send it to a large language model (LLM). The
          LLM analyzes queries through semantic mapping and term relationship scoring to generate optimized
          Solr search parameters and retrieve relevant results from our database, while also applying
          scoring algorithms and SDOH domain knowledge to enhance search accuracy. The analytical process,
          particularly query construction logic, is displayed below the search box to make the &quot;thinking&quot;
          process clearer and eliminate potential doubts about the LLM&apos;s function.
          </Typography>
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>No queries or information of any kind are sent to the LLM backend if you use the standard keyword search mode.</Typography>
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>We&apos;d love to hear your thoughts on this feature! Please <Link href="/contact">get in touch</Link>.</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={3}>
          Some sources provide data at the state level, while others may provide
          data at smaller resolutions like county or tract level. The interface
          makes it easy to filter by this geography level, or &quot;spatial
          resolution&quot;, allowing you to find only data relevant for your
          work.
          <List sx={{
              listStyleType: 'disc',
              listStylePosition: 'inside'
            }}>
            <ListItem sx={{ display: 'list-item' }}>State (largest, most general level)</ListItem>
            <ListItem sx={{ display: 'list-item' }}>County (subdivision of a state)</ListItem>
            <ListItem sx={{ display: 'list-item' }}>Census Tract (smaller geographical unit),</ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              Block Group (smallest unit, a subdivision of census tract)
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>ZIP Code Tabulation Area (ZCTA)</ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={4}>
        <Typography sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>
          Once you have performed a search or set a filter, you will get a list
          of the items matching your query. Each item will have a collection of
          metadata associated with it, as well as actions for further
          exploration:</Typography>
          <List sx={{
              listStyleType: 'disc',
              listStylePosition: 'inside'
            }}>
            <ListItem sx={{ display: 'list-item' }}>
              <span><strong>Show on map:</strong> Display a preview of what areas the
              dataset covers.</span>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <span><strong>Details:</strong> Open the item details panel and learn
              more about the dataset.</span>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <span><strong>Access:</strong> Leave the discovery app and head to
              the source location of this dataset, for download and further
              analysis.</span>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <span><strong>Share:</strong> Get a shareable link you can send
              to colleagues, the URL will bring them right to the same record
              you are looking at.</span>
            </ListItem>
          </List>
        </CustomTabPanel>
        <CustomTabPanel value={infoPanelTab} index={5}>
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>We provide a number of map overlay layers that can be used for contextual reference about community assets during your data search. This is a feature we hope to expand in the future, so please{" "}
            <Link href="/contact">get in touch</Link> if you have
            ideas for more layers you would like to see or contribute.
            </Typography>
          <Typography sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}><strong>Community asset layers:</strong></Typography>
          <List sx={{
              listStyleType: 'disc',
              listStylePosition: 'inside'
            }}>
            {Object.keys(overlayRegistry).map((key, index) => (
            <ListItem key={index}><span>
              <strong>{key}:</strong> {overlayRegistry[key].description}
               {/* [<Link href={overlayRegistry[key].url} target="_blank">learn more</Link>] */}
            </span>
            </ListItem>
            ))}
          </List>
          <Typography className="pb-1" sx={{fontFamily: fullConfig.theme.fontFamily['sans']}}>Currently, all layers are filtered from the <Link href="https://docs.overturemaps.org/guides/places/" target="_blank">Places</Link> dataset published by the <Link href="https://overturemaps.org" target="_blank">Overture Maps Foundation</Link>. Visit <Link href="https://github.com/healthyregions/overture-poi-extract" target="_blank">healthyregions/overture-poi-extract</Link> for details about the filtering process we use, and to download the raw data.</Typography>
        </CustomTabPanel>
      </Box>
    </div>
  );
}
