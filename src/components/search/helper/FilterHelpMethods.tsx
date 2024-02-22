import { SolrParent } from "meta/interface/SolrParent";
import FilterObject from "../interface/FilterObject";
import CheckBoxObject, { CheckBoxList } from "../interface/CheckboxObject";

export const generateFilter = (fetchResults) => {
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
				currentFilter.year[year] += 1;
			} else currentFilter.year[year] = 1;
		});
		result.resource_class.forEach((resource_class) => {
			if (currentFilter.resource_class[resource_class]) {
				currentFilter.resource_class[resource_class] += 1;
			} else currentFilter.resource_class[resource_class] = 1;
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
						result.meta[key].forEach((meta) => {
							if (currentFilter[key].hasOwnProperty(meta)) {
								currentFilter[key][meta] += 1;
							} else currentFilter[key][meta] = 1;
						});
					} else {
						if (
							currentFilter[key].hasOwnProperty(result.meta[key])
						) {
							currentFilter[key][result.meta[key]] += 1;
						} else currentFilter[key][result.meta[key]] = 1;
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
export const runningFilter = ({
	checkBoxStatus,
	originalResult,
}: {
	checkBoxStatus: CheckBoxList;
	originalResult: SolrParent[];
}) => {
	let fetchedResults = Object.values(checkBoxStatus).find(c=>c.checked === true)? []:originalResult;
	Object.values(checkBoxStatus).forEach((checkBox) => {
		if (checkBox.checked) {
			const attr = Object.keys(checkBox.value)[0];
			const value = checkBox.value[attr];
			filterResults(originalResult, attr, value).forEach((result) => {
				fetchedResults.push(result);
			});
		}
	});
    console.log("afterFilterOperation:", fetchedResults);
	return Array.from(new Set(fetchedResults.map((a) => a.id))).map((id) => {
		return fetchedResults.find((a) => a.id === id);
	});
};
