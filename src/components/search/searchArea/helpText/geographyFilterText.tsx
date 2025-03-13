import { List, ListItem } from "@mui/material";

export const GeographyFilterText = () => {
  return (
    <>
      Some sources provide data at the state level, while others may provide
      data at smaller resolutions like county or tract level. The interface
      makes it easy to filter by this geography level, or &quot;spatial
      resolution&quot;, allowing you to find only data relevant for your work.
      <List
        sx={{
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        <ListItem sx={{ display: "list-item" }}>
          State (largest, most general level)
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          County (subdivision of a state)
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Census Tract (smaller geographical unit),
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Block Group (smallest unit, a subdivision of census tract)
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          ZIP Code Tabulation Area (ZCTA)
        </ListItem>
      </List>
    </>
  );
};
