import { LngLatBoundsLike } from "react-map-gl/maplibre";
import {
  useQueryState,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsString,
  createParser,
} from "nuqs";
import { useMemo } from "react";

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

export const useUrlParams = () => {
  const [urlShowDetailPanel, setUrlShowDetailPanel] = useQueryState(
    "show",
    parseAsString.withDefault("")
  );
  // const [showSharedLink, setShowSharedLink] = useQueryState(
  //   "showSharedLink",
  //   parseAsString.withDefault("")
  // );
  // const [showInfoPanel, setShowInfoPanel] = useQueryState(
  //   "showInfoPanel",
  //   parseAsString.withDefault("")
  // );
  // const [showFilter, setShowFilter] = useQueryState(
  //   "showFilter",
  //   parseAsString.withDefault("")
  // );

  // // Search Parameters
  const [urlQuery, setUrlQuery] = useQueryState(
    "query",
    parseAsString.withDefault("")
  );
  // const [sortBy, setSortByParam] = useQueryState(
  //   "sortBy",
  //   parseAsString.withDefault("")
  // );
  // const [sortOrder, setSortOrderParam] = useQueryState(
  //   "sortOrder",
  //   parseAsString.withDefault("")
  // );
  
  // // Filter Parameters
  // const [resourceType, setResourceType] = useQueryState(
  //   "resource_type",
  //   parseAsString.withDefault("")
  // );

  const [urlSpatialResolution, setUrlSpatialResolution]: [string[], (value: string[]) => void] = useQueryState(
    "spatial_resolution",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [urlVisLyrs, setUrlVisLyrs] = useQueryState(
    "vis_lyrs",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  // const [bboxParam, setBboxParam] = useQueryState(
  //   "bbox",
  //   parseAsLngLatBoundsLike.withDefault(null)
  // );

  const updateUrlParams = (updates: {
    urlQuery?: string;
    urlShowDetailPanel?: string;
    urlSpatialResolution?: string[];
    urlVisLyrs?: string[];
  }) => {
    Object.entries(updates).forEach(([key, value]) => {
      switch(key) {
        case 'urlQuery':
          typeof value === 'string'? setUrlQuery(value) : setUrlQuery(null);
          break;
        case 'urlShowDetailPanel':
          typeof value === 'string'? setUrlShowDetailPanel(value) : setUrlShowDetailPanel(null);
          break;
        case 'urlSpatialResolution':
          Array.isArray(value)? setUrlSpatialResolution(value) : setUrlSpatialResolution([]);
          break;
        case 'urlVisLyrs':
          Array.isArray(value)? setUrlVisLyrs(value) : setUrlVisLyrs([]);
          break;
      }
    });
  }

  const parsedSpatialResolution = useMemo(() => {
    return urlSpatialResolution;
  }, [urlSpatialResolution]);

  return {
    setters: {
      setUrlQuery,
      setUrlShowDetailPanel,
      setUrlSpatialResolution,
      setUrlVisLyrs,
    },
    updateUrlParams,
    values: {
      urlQuery,
      urlShowDetailPanel,
      urlSpatialResolution: parsedSpatialResolution,
      urlVisLyrs,
    }
  };
};
