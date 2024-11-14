import * as React from "react";
import { makeStyles } from "@mui/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { GetAllParams, reGetFilterQueries } from "../helper/ParameterList";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { Box, Tabs, Tab, IconButton, Typography } from "@mui/material";

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
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, pl: 0 }}>{children}</Box>}
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
  let params = GetAllParams();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [maxHeight, setMaxHeight] = React.useState(0);
  const tabPanelRef = React.useRef(null);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleClosePanel = () => {
    params.setInfoPanel(null);
  };
  React.useEffect(() => {
    if (tabPanelRef.current) {
      const panels = Array.from(tabPanelRef.current.children) as HTMLElement[];
      const maxContentHeight = panels.reduce(
        (maxHeight, panel) => Math.max(maxHeight, panel.scrollHeight),
        0
      );
      setMaxHeight(maxContentHeight);
    }
  }, []);
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
        <IconButton
          onClick={handleClosePanel}
          style={{
            position: "absolute",
            left: -72,
            top: 4,
            color: fullConfig.theme.colors["frenchviolet"],
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>

        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            paddingLeft: "2em",
            minWidth: "fit-content",
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: fullConfig.theme.colors["frenchviolet"],
              height: "0.2em",
            },
          }}
        >
          <Tab
            sx={{ paddingRight: "2em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    value === 0
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Spatial resolution
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
            sx={{ paddingRight: "2em" }}
            label={
              <Typography
                sx={{
                  textTransform: "none",
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontWeight: 500,
                  color:
                    value === 1
                      ? fullConfig.theme.colors["frenchviolet"]
                      : fullConfig.theme.colors["almostblack"],
                }}
              >
                Search keywords
              </Typography>
            }
            {...a11yProps(1)}
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
          minHeight: maxHeight,
          transition: "height 0.3s ease",
        }}
        ref={tabPanelRef}
      >
        <CustomTabPanel value={value} index={0}>
          Spatial resolution is the level of geographic detail of how the data
          is displayed: state (largest, most general level), county (subdivision
          of a state, including multiple cities and towns), census tract
          (smaller geographical unit), block group (smallest unit, a subdivision
          of census tract), and ZIP Code.
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          If you know the general SDOH topic you are interested in finding data
          for, first try the themes in the <strong>Sort & Filter</strong> panel
          at left. Not finding the theme you want? Try typing it into the search
          bar to see if it appears in the auto-suggest dropdown, or just click
          &rarr; and see what you find!
        </CustomTabPanel>
      </Box>
    </div>
  );
}
