import { SolrParent } from "meta/interface/SolrParent";
import FilterObject from "../interface/FilterObject";
import CheckBoxObject from "../interface/CheckboxObject";

export const generateFilter = (
	fetchResults: SolrParent[],
	checkBoxes: CheckBoxObject[]
) => {
	let currentFilter = {
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
		spatial_resolution: {},
		methods_variables: {},
		data_variables: {},
	} as unknown as FilterObject;
	fetchResults.forEach((result) => {
		result.year.forEach((year) => {
			if (currentFilter.year[year]) {
				currentFilter.year[year].number += 1;
			} else currentFilter.year[year] = { number: 1, checked: false };
			if (
				checkBoxes.length > 0 &&
				checkBoxes.find(
					(c) => c.value === year && c.attribute === "year"
				) !== undefined &&
				checkBoxes.find(
					(c) => c.value === year && c.attribute === "year"
				).checked
			) {
				currentFilter.year[year].checked = true;
			} else {
				currentFilter.year[year].checked = false;
			}
		});
		result.resource_class.forEach((resource_class) => {
			if (currentFilter.resource_class[resource_class]) {
				currentFilter.resource_class[resource_class].number += 1;
			} else
				currentFilter.resource_class[resource_class] = {
					number: 1,
					checked: false,
				};
			if (
				checkBoxes.length > 0 &&
				checkBoxes.find(
					(c) =>
						c.value === resource_class &&
						c.attribute === "resource_class"
				) !== undefined &&
				checkBoxes.find(
					(c) =>
						c.value === resource_class &&
						c.attribute === "resource_class"
				).checked
			) {
				currentFilter.resource_class[resource_class].checked = true;
			} else {
				currentFilter.resource_class[resource_class].checked = false;
			}
		});
		// other attributes are in meta
		if (result.meta) {
			Object.keys(result.meta).forEach((key) => {
				if (
					key === "resource_type" ||
					key === "spatial_coverage" ||
					key === "format" ||
					key === "subject" ||
					key === "theme" ||
					key === "creator" ||
					key === "publisher" ||
					key === "provider" ||
					key === "spatial_resolution" ||
					key === "methods_variables" ||
					key === "data_variables"
				) {
					if (Array.isArray(result.meta[key])) {
						(result.meta[key] as string[]).forEach((metaData) => {
							if (currentFilter[key][metaData]) {
								currentFilter[key][metaData].number += 1;
							} else
								currentFilter[key][metaData] = {
									number: 1,
									checked: false,
								};

							if (
								checkBoxes.length > 0 &&
								checkBoxes.find(
									(c) =>
										c.value === metaData &&
										c.attribute === key
								) !== undefined &&
								checkBoxes.find(
									(c) =>
										c.value === metaData &&
										c.attribute === key
								).checked
							) {
								currentFilter[key][metaData].checked = true;
							} else {
								currentFilter[key][metaData].checked = false;
							}
						});
					} else if (typeof result.meta[key] === "string") {
						const metaString = result.meta[key] as string; // Type assertion
						if (currentFilter[key].hasOwnProperty(metaString)) {
							currentFilter[key][metaString].number += 1;
						} else
							currentFilter[key][metaString] = {
								number: 1,
								checked: false,
							};

						if (
							checkBoxes.length > 0 &&
							checkBoxes.find(
								(c) =>
									c.value === metaString &&
									c.attribute === key
							) !== undefined &&
							checkBoxes.find(
								(c) =>
									c.value === metaString &&
									c.attribute === key
							).checked
						) {
							currentFilter[key][metaString].checked = true;
						} else {
							currentFilter[key][metaString].checked = false;
						}
					}
				}
			});
		}
	});
	return currentFilter;
};

export const filterResults = (fetchedResults, key, value) => {
	let filteredResults = [];
	fetchedResults.forEach((result) => {
		if (result[key] !== undefined) {
			if (result[key].includes(value)) {
				filteredResults.push(result);
			}
		} else if (result.meta) {
			if (Array.isArray(result.meta[key])) {
				result.meta[key].forEach((meta) => {
					if (meta === value) {
						filteredResults.push(result);
					}
				});
			} else {
				if (result.meta[key] === value) {
					filteredResults.push(result);
				}
			}
		}
	});
	return filteredResults;
};

/**
 * example:
 * checkBoxStatus [
    {
        "label": "",
        "value": "",
        "checked": false
    }
]
 * checkBoxes here means user have used it, otherwise default value is unchecked, so only search 'true' value
 */
export const runningFilter = (
	checkBoxStatus: CheckBoxObject[],
	originalResult: SolrParent[]
) => {
	if (checkBoxStatus.find((c) => c.checked === true) === undefined)
		return originalResult;
	let fetchedResults = checkBoxStatus.find((c) => c.checked === true)
		? []
		: originalResult;
	checkBoxStatus.forEach((checkBox) => {
		if (checkBox.checked) {
			const attr = checkBox.attribute;
			const value = checkBox.value;
			if (fetchedResults.length === 0)
				fetchedResults = filterResults(originalResult, attr, value);
			else fetchedResults = filterResults(fetchedResults, attr, value);
		}
	});
	return Array.from(new Set(fetchedResults.map((a) => a.id))).map((id) => {
		return fetchedResults.find((a) => a.id === id);
	});
};
