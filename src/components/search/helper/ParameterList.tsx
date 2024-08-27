import { LngLatBoundsLike } from "react-map-gl/maplibre";
import {
  useQueryState,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsString,
  createParser,
} from "nuqs";

const parseAsLngLatBoundsLike = createParser({
  parse(queryValue) {
    const coords: number[] = queryValue
      .split(",")
      .map((coord) => parseFloat(coord));
    if (coords.length != 4) {
      return null;
    }
    const bboxParam: LngLatBoundsLike = [
      coords[0],
      coords[1],
      coords[2],
      coords[3],
    ];
    return bboxParam;
  },
  serialize(value) {
    return value.join(",");
  },
});

/**
 * The center location to manage all the query parameters
 * @returns all the query parameters as current state
 */
export const GetAllParams = () => {
  // showDetailPanel: if it is not empty, show the detail panel
  const [showDetailPanel, setShowDetailPanel] = useQueryState(
    "show",
    parseAsString.withDefault("")
  );
  const [showSharedLink, setShowSharedLink] = useQueryState(
    "showSharedLink",
    parseAsString.withDefault("")
  );

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

  //query: the search query
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault("")
  );

  //bboxSearch: boolean for whether to implement search by bounding box
  const [bboxSearch, setBboxSearch] = useQueryState(
    "bboxSearch",
    parseAsBoolean.withDefault(false)
  );

  //layers: the layers to be added to the map
  const [visLyrs, setVisLyrs] = useQueryState(
    "layers",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  //bbox: the current bounding box of the map, can be used for spatial queries
  const [bboxParam, setBboxParam] = useQueryState(
    "bbox",
    parseAsLngLatBoundsLike
  );

  //console.log("now in GetAllParams", showDetailPanel, showFilter, sortOrder, sortBy, resourceType, resourceClass, format, indexYear,query);
  return {
    showDetailPanel,
    setShowDetailPanel,
    showSharedLink,
    setShowSharedLink,
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
    bboxSearch,
    setBboxSearch,
    visLyrs,
    setVisLyrs,
    bboxParam,
    setBboxParam,
  };
};
