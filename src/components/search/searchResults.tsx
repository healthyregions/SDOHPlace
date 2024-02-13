import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { SolrObject } from "meta/interface/SolrObject";

/**
 * Display search results. Will be updated after re-design
 */
export default function SearchResults({
	searchResults,
    afterSearch
}: {
	searchResults: SolrObject[];
    afterSearch: boolean;
}): JSX.Element {
    if (!afterSearch) {
        return <Typography>You can start your search now.</Typography>;
    }
	return searchResults.length === 0 ? (
		<Typography>No results found</Typography>
	) : (
		<List>
			{searchResults.map((object, index) => (
				<ListItem key={index}>
					<ListItemText
						primary={`Object ${index + 1}`}
						secondary={
							<React.Fragment>
								{Object.entries(object).map(([key, value]) => (
									<Typography
										key={key}
									>{`${key}: ${value}`}</Typography>
								))}
							</React.Fragment>
						}
					/>
				</ListItem>
			))}
		</List>
	);
}
