import { List, ListItem, Typography } from "@mui/material";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export const SearchResultsText = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  return (
    <>
      <Typography sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}>
        Once you have performed a search or set a filter, you will get a list of
        the items matching your query. Each item will have a collection of
        metadata associated with it, as well as actions for further exploration:
      </Typography>
      <List
        sx={{
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        <ListItem sx={{ display: "list-item" }}>
          <span>
            <strong>Show on map:</strong> Display a preview of what areas the
            dataset covers.
          </span>
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <span>
            <strong>Details:</strong> Open the item details panel and learn more
            about the dataset.
          </span>
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <span>
            <strong>Access:</strong> Leave the discovery app and head to the
            source location of this dataset, for download and further analysis.
          </span>
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <span>
            <strong>Share:</strong> Get a shareable link you can send to
            colleagues, the URL will bring them right to the same record you are
            looking at.
          </span>
        </ListItem>
      </List>
    </>
  );
};
