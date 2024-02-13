import { use, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import { Autocomplete, Grid } from "@mui/material";
import { SearchObject } from "./interface/SearchObject";
import SearchResults from "./searchResults";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";

export default function SearchArea(): JSX.Element {
	const [fetchResults, setFetchResults] = useState<SolrObject[]>([]);
	const [queryData, setQueryData] = useState<SearchObject>({
		userInput: "",
		// other attributes are pending to be added with the development of the search component
	});
	const [options, setOptions] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [afterSearch, setAfterSearch] = useState(false);

	let searchQueryBuilder = new SolrQueryBuilder();

	const handleSearch = async () => {
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				setFetchResults(result);
			})
			.catch((error) => {
				console.error("Error fetching result:", error);
			});
		setAfterSearch(true); // Set afterSearch to true after search to remove "You can start your search now."
	};

	const handleUserInputChange = async (event, value) => {
		setUserInput(value);
		setQueryData({
			...queryData,
			userInput: value,
		});
		searchQueryBuilder.autocompleteQuery(value); 
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				const autoCompleteResult = result.map((doc) => doc.title);
				setOptions(autoCompleteResult);
			})
			.catch((error) => {
				console.error("Error fetching result:", error);
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		userInput.length === 0
			? searchQueryBuilder.generalQuery("*")
			: searchQueryBuilder.generalQuery(userInput); //change query type based on form's situation
		handleSearch();
	};
	 const handleDropdownSelect = (event, value) => {
			searchQueryBuilder.phraseQuery("dct_title_s", value);
			handleSearch();
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
										handleUserInputChange(event, value);
									}
								}}
								onChange={(event, value) =>
									handleDropdownSelect(event, value)
								}
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
				<SearchResults
					searchResults={fetchResults}
					afterSearch={afterSearch}
				/>
			</Grid>
		</div>
	);
}
