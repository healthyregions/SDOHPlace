import { parseAsString, useQueryState } from "nuqs";

/**
 * The center location to manage all the query parameters
 * @returns all the query parameters as current state
 */
export const GetAllParams = () => {
  // showDetailPanel: if it is not empty, show the detail panel
  const showDetailPanel = useQueryState("show", parseAsString.withDefault(""));
  // showFilter: if it is not empty, show the filter
  const [showFilter, setShowFilter] = useQueryState(
    "showFilter",
    parseAsString.withDefault("")
  );
  // parameters for filtering, must exist in the list in searchUIConfig.tsx
  const [resourceType, setResourceType] = useQueryState(
    "resource_type",
    parseAsString.withDefault("")
  );
  const [resourceClass, setResourceClass] = useQueryState(
    "resource_class",
    parseAsString.withDefault("")
  );
  const [format, setFormat] = useQueryState(
    "format",
    parseAsString.withDefault("")
  );
  const [indexYear, setIndexYear] = useQueryState(
    "index_year",
    parseAsString.withDefault("")
  );
  // sort_order: the order of the search results
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("")
  );
  //sort_by: the field to sort the search results
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("")
  );
  // query: the search query
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault("")
  );

  console.log("now in GetAllParams", showDetailPanel, showFilter, sortOrder, sortBy, resourceType, resourceClass, format, indexYear, query);
  return {
    showDetailPanel,
    showFilter,
    setShowFilter,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
    resourceType,
    setResourceType,
    resourceClass,
    setResourceClass,
    format,
    setFormat,
    indexYear,
    setIndexYear,
    query,
    setQuery,
  };
};
