import { List, ListItem, Typography } from "@mui/material";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export const KeywordSearchText = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  return (
    <>
      <Typography sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}>
        As you type search terms into the main search box, you will notice that
        suggestions appear below the input box. This suggestion list is pulled
        straight from the data itself (we have tried to index a lot of
        information about each record) but there may still be times that your
        search turns up no results. In this case, it never hurts to try another
        word for your topic, or even just go ahead with a theme filter and
        browse through all results.
      </Typography>
      <List>
        <ListItem>
          Tip: If you have used the search bar to make your query, you will then
          be able to hover each result to learn more about why that item matched
          your query.
        </ListItem>
      </List>
    </>
  );
};
