// NOTE: most methods in this file are not used in the search component now. Still save them here for future possible filter implementation.

import FilterObject from "../interface/FilterObject";
import { SolrObject } from "meta/interface/SolrObject";
import { SearchUIConfig } from "@/components/searchUIConfig";

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
