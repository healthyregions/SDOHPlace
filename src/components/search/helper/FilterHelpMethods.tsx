// NOTE: most methods in this file are not used in the search component now. Still save them here for future possible filter implementation.

import FilterObject from "../interface/FilterObject";
import CheckBoxObject from "../interface/CheckboxObject";
import SolrQueryBuilder from "./SolrQueryBuilder";
import { filterParentList } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { SearchUIConfig } from "@/components/searchUIConfig";

// attributes that are not in meta as a SolrObject. All attributes here needs to be part of filter
const topLevelList = ["index_year", "resource_class", "creator"];

/**
 * Collect possible options for filter based on results
 * @param resultList
 */
export const generateFilterList = (resultList: SolrObject[]) => {
  let res = {};
  let filterList: string[] = SearchUIConfig.search.searchFilters.filters.map(
    (d) => d.attribute
  );
  const metaAttributes = SearchUIConfig.search.searchFilters.filters
    .filter((item) => item.meta === true)
    .map((item) => item.attribute);
  resultList.forEach((result) => {
    filterList.forEach((attribute) => {
      if (!res[attribute]) res[attribute] = [];
      if (!metaAttributes.includes(attribute)) {
        if (!Array.isArray(result[attribute]))
          result[attribute] = [result[attribute]];
        (result[attribute] as string[]).forEach((attr) => {
          res[attribute].push(attr);
        });
      } else {
        if (Array.isArray(result.meta[attribute])) {
          (result.meta[attribute] as string[]).forEach((attr) => {
            res[attribute].push(attr);
          });
        } else if (typeof result.meta[attribute] === "string") {
          const metaString = result.meta[attribute] as string; // Type assertion
          res[attribute].push(metaString);
        }
      }
      res[attribute] = Array.from(new Set(res[attribute]));
    });
  });
  return res;
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
  q: string,
  checkBoxStatus: CheckBoxObject[],
  originalResult: SolrObject[],
  schema_json: {}
): Promise<SolrObject[]> => {
  if (checkBoxStatus.find((c) => c.checked === true) === undefined) {
    return Promise.resolve(originalResult);
  }

  let filterQueryBuilder = new SolrQueryBuilder();
  filterQueryBuilder.setSchema(schema_json);
  let filters: { attribute: string; value: string }[] = [];
  checkBoxStatus.forEach((checkBox) => {
    if (checkBox.checked) {
      const attribute = checkBox.attribute;
      const value = checkBox.value;
      filters.push({ attribute, value });
    }
  });
  filterQueryBuilder.filterQuery(q, filters);

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
