import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Checkbox,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { SearchObject } from "./interface/SearchObject";
import SolrQueryBuilder from "./helper/SolrQueryBuilder";
import SuggestedResult from "./helper/SuggestedResultBuilder";
import ParentList from "./parentList";
import {
	filterParentList,
	generateSolrParentList,
} from "meta/helper/solrObjects";
// import { SolrParent } from "meta/interface/SolrParent";
import FilterObject from "./interface/FilterObject";
import {
	generateFilter,
	filterResults,
	runningFilter,
	updateFilter,
} from "./helper/FilterHelpMethods";
import { fi } from "date-fns/locale";
import CheckBoxObject from "./interface/CheckboxObject";

export default function SearchArea({
	results,
	filterAttributeList,
}: {
	results: SolrObject[];
	filterAttributeList: {
		attribute: string;
		displayName: string;
	}[];
}): JSX.Element {
	const [fetchResults, setFetchResults] = useState<SolrObject[]>(
		generateSolrParentList(results)
	);
	const [originalResults, setOriginalResults] =
		useState<SolrObject[]>(fetchResults);
	const [queryData, setQueryData] = useState<SearchObject>({
		userInput: "",
	});
	const [checkboxes, setCheckboxes] = useState([]);
	const [options, setOptions] = useState([]);
	const [userInput, setUserInput] = useState("");
	const constructFilter = filterAttributeList.map((filter) => {
		return {
			[filter.attribute]: {},
		};
	});
	const [currentFilter, setCurrentFilter] = useState(
		constructFilter as unknown as FilterObject
	);

	let searchQueryBuilder = new SolrQueryBuilder();
	let suggestResultBuilder = new SuggestedResult();

	const handleSearch = async (value) => {
		searchQueryBuilder
			.fetchResult()
			.then((result) => {
				processResults(result, value);
				// if multiple terms are returned, we get all weight = 1 terms (this is done in SuggestionsResultBuilder), then aggregate the results for all terms
				if (suggestResultBuilder.getTerms().length > 0) {
					const multipleResults = [] as SolrObject[];
					suggestResultBuilder.getTerms().forEach((term) => {
						searchQueryBuilder.generalQuery(term);
						searchQueryBuilder.fetchResult().then((result) => {
							generateSolrParentList(result).forEach((parent) => {
								multipleResults.push(parent);
							});
							// remove duplicates by id
							const newResults = Array.from(
								new Set(multipleResults.map((a) => a.id))
							).map((id) => {
								return multipleResults.find((a) => a.id === id);
							});
							setCurrentFilter(
								generateFilter(
									newResults,
									checkboxes,
									filterAttributeList.map(
										(filter) => filter.attribute
									)
								)
							);
							setOriginalResults(newResults);
							setFetchResults(newResults);
						});
					});
				} else {
					searchQueryBuilder.generalQuery(value);
					searchQueryBuilder.fetchResult().then((result) => {
						const newResults = generateSolrParentList(result);
						setCurrentFilter(
							generateFilter(
								newResults,
								checkboxes,
								filterAttributeList.map(
									(filter) => filter.attribute
								)
							)
						);
						setOriginalResults(newResults);
						setFetchResults(newResults);
					});
				}
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
		if (
			!newCheckboxes.find(
				(c) => c.value === value && c.attribute === attr
			)
		) {
			newCheckboxes.push({
				attribute: attr,
				value: value,
				checked: event.target.checked,
			});
		}
		newCheckboxes.find(
			(c) => c.value === value && c.attribute === attr
		).checked = event.target.checked;

		runningFilter(newCheckboxes, originalResults).then((newResults) => {
			setFetchResults(newResults);
			setCurrentFilter(
				generateFilter(
					newResults,
					newCheckboxes,
					filterAttributeList.map((filter) => filter.attribute)
				)
			);
		});
		setCheckboxes(newCheckboxes);
	};

	useEffect(() => {
		const generateFilterFromCurrentResults = generateFilter(
			fetchResults,
			checkboxes,
			filterAttributeList.map((filter) => filter.attribute)
		);
		setCurrentFilter(generateFilterFromCurrentResults);
	}, []);

	/** Components */
	function FilterAccordion({
		key,
		currentCheckboxes,
		currentFilter,
		attributeName,
		displayName,
	}) {
		return currentFilter.hasOwnProperty(attributeName) ? (
			<Accordion defaultExpanded={false} key={key}>
				<AccordionSummary
					expandIcon={<ArrowDropDownIcon />}
					aria-controls="year-content"
					id="year-header"
				>
					<Typography
						sx={{
							color:
								currentCheckboxes.find(
									(e) =>
										e.attribute === attributeName &&
										e.checked
								) === undefined
									? "black"
									: "green",
						}}
					>
						{displayName}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{Object.keys(currentFilter[attributeName]).map((s) => {
						return (
							<div key={s}>
								<span>
									{s}:{currentFilter[attributeName][s].number}
								</span>
								<Checkbox
									sx={{
										display:
											s.length > 0 ? "inline" : "none",
									}}
									checked={
										currentFilter[attributeName][s].checked
									}
									value={{
										[attributeName]: s,
									}}
									onChange={handleFilter(attributeName, s)}
								/>
							</div>
						);
					})}
				</AccordionDetails>
			</Accordion>
		) : null;
	}
	function filterStatusButton(c: CheckBoxObject) {
		return (
			<Button
				key={c.value}
				sx={{margin: "0.5em"}}
				variant="outlined"
				color="success"
				endIcon={<CloseIcon />}
				onClick={() => {
					const cancelEvent = {
						target: { checked: false },
					};
					handleFilter(c.attribute, c.value)(cancelEvent);
				}}
			>
				{c.attribute}:{c.value}
			</Button>
		);
	}
	return (
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
											handleUserInputChange(event, value);
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
												endAdornment: null,
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
					{/* IMPORTANT: for filter name, use the key from the schema as function parameter and value */}
					<Grid item xs={12}>
						{filterAttributeList.map((filter, index) => (
							<FilterAccordion
								key={index}
								currentCheckboxes={checkboxes}
								currentFilter={currentFilter}
								attributeName={filter.attribute}
								displayName={filter.displayName}
							/>
						))}
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={8}>
				<Box sx={{ display: "flex", justifyContent: "flex-start" }}>
					{checkboxes
						.filter((c) => c.checked === true)
						.map((c) => filterStatusButton(c))}
				</Box>
				<ParentList
					solrParents={fetchResults}
					filterAttributeList={filterAttributeList}
				/>
			</Grid>
		</Grid>
	);
}
