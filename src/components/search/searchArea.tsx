import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Checkbox,
	Divider,
	Grid,
	Switch,
	Typography,
} from "@mui/material";
import { SearchObject } from "./interface/SearchObject";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import ParentList from "./parentList";
import { generateSolrParentList } from "meta/helper/solrObjects";
import { SolrParent } from "meta/interface/SolrParent";
import FilterObject from "./interface/FilterObject";
import {
	generateFilter,
	filterResults,
	runningFilter,
} from "./helper/FilterHelpMethods";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckBoxObject from "./interface/CheckboxObject";

export default function SearchArea({
	results,
}: {
	results: SolrObject[];
}): JSX.Element {
	const [fetchResults, setFetchResults] = useState<SolrParent[]>(
		generateSolrParentList(results)
	);
	const [originalResults, setOriginalResults] =
		useState<SolrParent[]>(fetchResults);
	const [queryData, setQueryData] = useState<SearchObject>({
		userInput: "",
	});
	const [checkboxes, setCheckboxes] = useState([]);
	const [options, setOptions] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [currentFilter, setCurrentFilter] = useState({
		year: {},
		resource_class: {},
		resource_type: {},
		spatial_coverage: {},
		format: {},
		subject: {},
		theme: {},
		creator: {},
		publisher: {},
		provider: {},
		spatial_coverage: {},
		methods_variables: {},
		data_variables: {},
	} as unknown as FilterObject);

	let searchQueryBuilder = new SolrQueryBuilder();
	let suggestResultBuilder = new SuggestedResult();

	const handleSearch = async (value) => {
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				processResults(result, value);

				if (suggestResultBuilder.getTerms().length > 0) {
					const multipleResults = [] as SolrParent[];
					suggestResultBuilder.getTerms().forEach((term) => {
						searchQueryBuilder.generalQuery(term);
						searchQueryBuilder.fetchResult().then((result) => {
							generateSolrParentList(result).forEach((parent) => {
								multipleResults.push(parent);
							});
							// remove duplicates by id
							setFetchResults(
								Array.from(
									new Set(multipleResults.map((a) => a.id))
								).map((id) => {
									return multipleResults.find(
										(a) => a.id === id
									);
								})
							);
						});
					});
				} else {
					searchQueryBuilder.generalQuery(value);
					searchQueryBuilder.fetchResult().then((result) => {
						setFetchResults(generateSolrParentList(result));
					});
				}

				setOriginalResults(fetchResults);
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
		handleSearch(value);
	};
	const processResults = (results, value) => {
		suggestResultBuilder.setSuggester("mySuggester"); //this could be changed to a different suggester
		suggestResultBuilder.setSuggestInput(value);
		suggestResultBuilder.setResultTerms(JSON.stringify(results));
	};

	const handleFilter = (attr, value) => (event) => {
		const newCheckboxes = [...checkboxes];
		if (!newCheckboxes.find((c) => c.value === value && c.attribute === attr)) {
			newCheckboxes.push({
				attribute: attr,
				value: value,
				checked: event.target.checked,
			});
		}
		newCheckboxes.find(
			(c) => c.value === value && c.attribute === attr
		).checked = event.target.checked;
		const newResults = runningFilter(
			newCheckboxes,originalResults
		);
		setCheckboxes(newCheckboxes);
		setFetchResults(newResults);
		setCurrentFilter(generateFilter(newResults, newCheckboxes));
	};

	useEffect(() => {
		//Only run once
		const generateFilterFromCurrentResults = generateFilter(fetchResults, checkboxes);
		setCurrentFilter(generateFilterFromCurrentResults);
	}, []);

	return (
		<div className="flex flex-col">
			<Grid container spacing={2}>
				<Grid container xs={4}>
					<Grid container className="search_box_container">
						<form id="search-form" onSubmit={handleSubmit}>
							<Grid container alignItems="center">
								<Grid item xs={9}>
									<Autocomplete
										freeSolo
										disableClearable
										options={options}
										onInputChange={(event, value) => {
											if (event.type === "change") {
												setUserInput(value);
												handleUserInputChange(
													event,
													value
												);
											}
										}}
										onChange={(event, value) => {
											setUserInput(value);
											handleDropdownSelect(event, value);
										}}
										sx={{ minWidth: 250 }}
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
					<Divider />
					<Grid container className="search_filter_container">
						<Grid item xs={12}>
							<Accordion>
								<AccordionSummary
									expandIcon={<ArrowDropDownIcon />}
									aria-controls="year-content"
									id="year-header"
								>
									<Typography>Year</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{Object.keys(currentFilter.year).map(
										(s) => {
											return (
												<div key={s}>
													<span>
														{s}:
														{
															currentFilter.year[
																s
															].number
														}
													</span>
													<Checkbox
														checked={
															currentFilter.year[
																s
															].checked
														}
														value={{ year: s }}
														onChange={handleFilter(
															"year",
															s
														)}
													/>
												</div>
											);
										}
									)}
								</AccordionDetails>
							</Accordion>
							<Accordion>
								<AccordionSummary
									expandIcon={<ArrowDropDownIcon />}
									aria-controls="creator-content"
									id="creator-header"
								>
									<Typography>Creator</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{Object.keys(currentFilter.creator).map(
										(s) => {
											return (
												<div key={s}>
													<span>
														{s}:
														{
															currentFilter
																.creator[s]
																.number
														}
													</span>
													<Checkbox
														checked={
															currentFilter
																.creator[s]
																.checked
														}
														value={{ creator: s }}
														onChange={handleFilter(
															"creator",
															s
														)}
													/>
												</div>
											);
										}
									)}
								</AccordionDetails>
							</Accordion>
							<Accordion>
								{/* Note: Spacial Coverage are too long for initial display, need to add 'more' function later */}
								<AccordionSummary
									expandIcon={<ArrowDropDownIcon />}
									aria-controls="spatial_coverage-content"
									id="spatial_coverage-header"
								>
									<Typography>Spatial Coverage</Typography>
								</AccordionSummary>
								<AccordionDetails
									sx={{
										"&.MuiAccordionDetails-root": {
											overflowY: "scroll",
											maxHeight: "20em",
										},
									}}
								>
									{Object.keys(currentFilter.spatial_coverage).map(
										(s) => {
											return (
												<div key={s}>
													<span>
														{s}:
														{
															currentFilter
																.spatial_coverage[
																s
															].number
														}
													</span>
													<Checkbox
														checked={
															currentFilter
																.spatial_coverage[
																s
															].checked
														}
														value={{
															spatial_coverage:
																s,
														}}
														onChange={handleFilter(
															"spatial_coverage",
															s
														)}
													/>
												</div>
											);
										}
									)}
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={8}>
					<ParentList solrParents={fetchResults} />
				</Grid>
			</Grid>
		</div>
	);
}
