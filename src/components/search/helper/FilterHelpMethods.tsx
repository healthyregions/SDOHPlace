import FilterObject from "../interface/FilterObject";
import CheckBoxObject from "../interface/CheckboxObject";
import SolrQueryBuilder from "./SolrQueryBuilder";
import { filterParentList } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";

// attributes that are not in meta as a SolrObject. All attributes here needs to be part of filter
const topLevelList = [
	"index_year",
	"resource_class",
	"creator",
];

/**
 * for attribute name, using the same key as solr schema
 * Matching needs to use the same attribute name as the solr schema
 */
export const generateFilter = (
	fetchResults: SolrObject[],
	checkBoxes: CheckBoxObject[],
	filterList: string[]
) => {
	let currentFilter = {} as unknown as FilterObject;
	filterList.map((filter) => {
		currentFilter[filter] = {};
	});
	fetchResults.forEach((result) => {
		topLevelList.forEach((attribute) => {
			if (result[attribute]) {
					if (!Array.isArray(result[attribute]))
						result[attribute] = [result[attribute]];
					(result[attribute] as string[]).forEach((attr) => {
						if (currentFilter[attribute][attr]) {
							currentFilter[attribute][attr].number += 1;
						} else
							currentFilter[attribute][attr] = {
								number: 1,
								checked: false,
							};
						if (
							checkBoxes.length > 0 &&
							checkBoxes.find(
								(c) =>
									c.value === attr &&
									c.attribute === attribute
							) !== undefined &&
							checkBoxes.find(
								(c) =>
									c.value === attr &&
									c.attribute === attribute
							).checked
						) {
							currentFilter[attribute][attr].checked = true;
						} else {
							currentFilter[attribute][attr].checked = false;
						}
					});
			}
		});
		// other attributes are in meta
		if (result.meta) {
			Object.keys(result.meta).forEach((key) => {
				if (filterList.includes(key) && !topLevelList.includes(key)) {
					if (Array.isArray(result.meta[key])) {
						(result.meta[key] as string[]).forEach((metaData) => {
							// if a term appears multiple times within a attributes, only count onces as GeoBlacklight currently doing
							if (!currentFilter[key][metaData])
								currentFilter[key][metaData] = {
									number: 1,
									checked: false,
								};
							else currentFilter[key][metaData].number += 1;
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

export const updateFilter = (
	currentFilter: FilterObject,
	attribute: string,
	value: string,
	checked: boolean
) => {
	currentFilter[attribute][value].checked = checked;
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
	originalResult: SolrObject[]
): Promise<SolrObject[]> => {
	if (checkBoxStatus.find((c) => c.checked === true) === undefined) {
		return Promise.resolve(originalResult);
	}

	let filterQueryBuilder = new SolrQueryBuilder();
	let filters: { attribute: string; value: string }[] = [];
	checkBoxStatus.forEach((checkBox) => {
		if (checkBox.checked) {
			const attribute = checkBox.attribute;
			const value = checkBox.value;
			filters.push({ attribute, value });
		}
	});
	filterQueryBuilder.filterQuery(filters);

	// Return a promise that resolves with the filtered result
	return new Promise((resolve, reject) => {
		filterQueryBuilder
			.fetchResult()
			.then((result) => {
				const filteredParentList = filterParentList(result);
				// find overlap between originalResult and filteredParentList
				const overlap = originalResult.filter((parent) =>
					filteredParentList.find(
						(filteredParent) => filteredParent.id === parent.id
					)
				);
				resolve(overlap);
			})
			.catch(reject);
	});
};
