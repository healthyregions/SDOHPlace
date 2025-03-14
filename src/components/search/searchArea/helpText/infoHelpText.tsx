import { List, ListItem } from "@mui/material";
export const InfoHelpText = () => {
  return (
    <>
      Welcome to our data discovery application. Here are a few ways for you to
      get started:
      <List>
        <ListItem>
          <span>
            <strong>Search by terms:</strong> Use the main search bar to search
            for a concept you are interested in. As you type, a dropdown will
            appear with suggestions pulled directly from the datasets
            themselves.
          </span>
        </ListItem>
        <ListItem>
          <span>
            <strong>Filter by geography:</strong> Are you looking only for
            county-level data? Use the &quot;County&quot; filter to only show
            datasets at that level.
          </span>
        </ListItem>
        <ListItem>
          <span>
            <strong>Filter by theme or year:</strong> Researching food access?
            Only want the latest data? Click the &quot;Sort & Filter&quot;
            button to narrow results by theme and date.
          </span>
        </ListItem>
        <ListItem>
          <span>
            <strong>Filter by location:</strong> Only looking for datasets that
            cover your state or city? Use the search box within the map to find
            a place and filter for datasets that geographically overlap it.
          </span>
        </ListItem>
      </List>
    </>
  );
};
