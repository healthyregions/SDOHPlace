import { LngLatBoundsLike } from "react-map-gl/maplibre";
import {
  useQueryState,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsString,
  createParser,
} from "nuqs";
import React from "react";

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
  const [showInfoPanel, setInfoPanel] = useQueryState(
    "showInfoPanel",
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

  // subject tags: the tags to filter the search results
  const [subject, setSubject] = useQueryState(
    "subject",
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
  const [spatialResolution, setSpatialResolution] = useQueryState(
    "spatial_resolution",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  //layers: the overlays to be shown on the map
  const [visOverlays, setVisOverlays] = useQueryState(
    "overlays",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  //bbox: the current bounding box of the map, can be used for spatial queries
  const [bboxParam, setBboxParam] = useQueryState(
    "bbox",
    parseAsLngLatBoundsLike
  );

  // prevAction: the previous action
  const [prevAction, setPrevAction] = useQueryState(
    "prevAction",
    parseAsString.withDefault("")
  );

  return React.useMemo(
    () => ({
      showDetailPanel,
      setShowDetailPanel,
      showSharedLink,
      setShowSharedLink,
      showInfoPanel,
      setInfoPanel,
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
      subject,
      setSubject,
      query,
      setQuery,
      bboxSearch,
      setBboxSearch,
      visLyrs,
      setVisLyrs,
      visOverlays,
      setVisOverlays,
      spatialResolution,
      setSpatialResolution,
      bboxParam,
      setBboxParam,
      prevAction,
      setPrevAction,
    }),
    [
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
      subject,
      setSubject,
      query,
      setQuery,
      bboxSearch,
      setBboxSearch,
      visLyrs,
      setVisLyrs,
      visOverlays,
      setVisOverlays,
      spatialResolution,
      setSpatialResolution,
      bboxParam,
      setBboxParam,
      prevAction,
      setPrevAction,
    ]
  );
};

/**
 * Re-update everything based on the status of current url. May improve later by separating the update functions
 */
export const updateAll = (
  params,
  newSortBy,
  newSortOrder,
  newFilterQueries,
  searchTerm
) => {
  params.setSortBy(newSortBy ? newSortBy : null);
  params.setSortOrder(newSortOrder ? newSortOrder : null);
  params.setSpatialResolution(null);
  params.setVisLyrs(null);
  params.setIndexYear(null);
  params.setSubject(null);
  newFilterQueries.forEach((filter) => {
    if (filter.attribute === "spatial_resolution") {
      params.setSpatialResolution((prev) =>
        prev ? Array.from(new Set(prev.concat(filter.value))) : [filter.value]
      );
    }
    if (filter.attribute === "layers") {
      params.setVisLyrs((prev) =>
        prev ? Array.from(new Set(prev.concat(filter.value))) : [filter.value]
      );
    }
    if (filter.attribute === "subject") {
      params.setSubject((prev) =>
        prev ? Array.from(new Set(prev.concat(filter.value))) : [filter.value]
      );
    }
    if (filter.attribute === "index_year") {
      params.setIndexYear((prev) =>
        prev ? `${prev},${filter.value}` : filter.value
      );
    }
  });

  if (searchTerm) {
    params.setQuery(searchTerm);
  }
};

/**
 * get newest filter queries based on the current url in {attribute, value} format
 */
export const reGetFilterQueries = (params) => {
  const res = [];
  if (params.spatialResolution) {
    params.spatialResolution.forEach((i) => {
      res.push({ attribute: "spatial_resolution", value: i });
    });
  }
  if (params.subject) {
    if (typeof params.subject === "string") {
      params.subject.split(",").forEach((i) => {
        res.push({ attribute: "subject", value: i });
      });
    } else {
      params.subject.forEach((i) => {
        res.push({ attribute: "subject", value: i });
      });
    }
  }
  if (params.visLyrs) {
    params.visLyrs.forEach((i) => {
      res.push({ attribute: "layers", value: i });
    });
  }
  if (params.indexYear) {
    if (typeof params.indexYear === "string") {
      params.indexYear.split(",").forEach((i) => {
        res.push({ attribute: "index_year", value: i });
      });
    } else {
      params.indexYear.forEach((i) => {
        res.push({ attribute: "index_year", value: i });
      });
    }
  }
  if (params.query) {
    res.push({ attribute: "query", value: params.query });
  }
  return res;
};

export const resetAllFilters = (params) => {
  params.setPrevAction("filter");
  params.setSpatialResolution(null);
  params.setVisLyrs(null);
  params.setIndexYear(null);
  params.setSubject(null);
  params.setSortOrder(null);
};

export const isFiltersOn = (params) => {
  return (
    params.spatialResolution.length > 0 ||
    params.visLyrs.length > 0 ||
    params.indexYear.length > 0 ||
    params.subject.length > 0
  );
};
