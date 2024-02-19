import { use, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import { Autocomplete, Grid } from "@mui/material";
import { SearchObject } from "./interface/SearchObject";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import ParentList from "./parentList";
import {
	generateSolrParentList,
} from "meta/helper/solrObjects";
import { SolrParent } from "meta/interface/SolrParent";

export default function SearchArea({
	results,
}: {
	results: SolrObject[];
}): JSX.Element {
	const [fetchResults, setFetchResults] = useState<SolrParent[]>(
		generateSolrParentList(results)
	);
	const [queryData, setQueryData] = useState<SearchObject>({
		userInput: "",
	});
	const [options, setOptions] = useState([]);
	const [userInput, setUserInput] = useState("");

	let searchQueryBuilder = new SolrQueryBuilder();
	let suggestResultBuilder = new SuggestedResult();

	const handleSearch = async (value) => {
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				processResults(result, value);
				if (suggestResultBuilder.getTerms().length > 0)
					searchQueryBuilder.generalQuery(
						suggestResultBuilder.getTerms()[0] //use the first term from the suggest result
					);
				else searchQueryBuilder.generalQuery(value);
				searchQueryBuilder.fetchResult().then((result) => {
					console.log("search result: ", result);
					setFetchResults(generateSolrParentList(result));
				});
			})
			.catch((error) => {
				console.error("Error fetching result:", error);
			});
	};

	const handleUserInputChange = async (event, value) => {
		setQueryData({
			...queryData,
			userInput: value,
		});
		searchQueryBuilder.suggestQuery(value);
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				processResults(result, value);
				setOptions(suggestResultBuilder.getTerms());
			})
			.catch((error) => {
				console.error("Error fetching result:", error);
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		searchQueryBuilder.suggestQuery(userInput);
		handleSearch(userInput);
	};
	const handleDropdownSelect = (event, value) => {
		searchQueryBuilder.suggestQuery(value);
		console.log("select item from dropdown is: ", value);
		handleSearch(value);
	};
	const processResults = (results, value) => {
		suggestResultBuilder.setSuggester("mySuggester"); //this could be changed to a different suggester
		suggestResultBuilder.setSuggestInput(value);
		suggestResultBuilder.setResultTerms(JSON.stringify(results));
	};

	return (
		<div className="flex flex-col">
			<Grid container spacing={4}>
				<form id="search-form" onSubmit={handleSubmit}>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={9}>
							<Autocomplete
								freeSolo
								disableClearable
								options={options}
								onInputChange={(event, value) => {
									if (event.type === "change") {
										setUserInput(value);
										handleUserInputChange(event, value);
									}
								}}
								onChange={(event, value) => {
									setUserInput(value);
									handleDropdownSelect(event, value);
								}}
								sx={{ width: 300 }}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Search input"
										variant="outlined"
										fullWidth
										InputProps={{
											...params.InputProps,
											type: "search",
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={3}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
							>
								Search
							</Button>
						</Grid>
					</Grid>
				</form>
			</Grid>
			<Grid item xs={6}>
				<ParentList solrParents={fetchResults} />
				{/* PAUSE THE SEARCH RESULTS: show parent list first, then filter list by term
				<SearchResults
					suggestResultBuilder s={fetchResults}
					afterSearch={afterSearch}
				/> */}
			</Grid>
		</div>
	);
}
