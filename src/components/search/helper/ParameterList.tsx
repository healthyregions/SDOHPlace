import { parseAsString, useQueryState } from "nuqs";

/**
 * The center location to manage all the query parameters
 * @returns all the query parameters as current state
 */
export const GetAllParams = () => {
  // isQuery: if it's length>0, items are results of a query
  const isQuery = useQueryState('isQuery', parseAsString.withDefault(""));

  // showDetailPanel: if it is not empty, show the detail panel
  const showDetailPanel = useQueryState('show', parseAsString.withDefault(""));

  // showFilter: if it is not empty, show the filter
  const showFilter = useQueryState('showFilter', parseAsString.withDefault(""));

  // parameters for filtering, must exist in the list in searchUIConfig.tsx
  const resource_type = useQueryState('resource_type', parseAsString.withDefault(""));
  const resource_class = useQueryState('resource_class', parseAsString.withDefault(""));
  const format = useQueryState('format', parseAsString.withDefault(""));
  const index_year = useQueryState('index_year', parseAsString.withDefault(""));

  // query: the search query
  const query = useQueryState('query', parseAsString.withDefault(""));

  return {
    isQuery,
    showDetailPanel,
    showFilter,
    resource_type,
    resource_class,
    format,
    index_year,
    query
  };
};