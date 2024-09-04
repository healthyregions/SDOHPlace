"use client";
import { useEffect, useState, useCallback, useMemo, useRef, use } from "react";

import {
  Map,
  MapRef,
  useMap,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  Popup,
  Layer,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import {
  LayerSpecification,
  FilterSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import layer_match from "../../../meta/_metadata/layer_match.json";
import { SolrObject } from "meta/interface/SolrObject";
import {
  displayLayers,
  interactiveLayers,
  LayerDef,
  poiLayer,
  layerRegistry,
} from "../../components/map/helper/layers";
import { sources } from "../../components/map/helper/sources";

import { ZoomButton, EnableBboxSearchButton } from "./mapButtons";

import getCountyGeo from "./helper/countyLocation";
import CheckBoxObject from "../search/interface/CheckboxObject";
import { GetAllParams } from "../search/helper/ParameterList";
import { set } from "date-fns";

// Define interface for map object
interface CustomMap extends maplibregl.Map {
  _popup?: maplibregl.Popup | null;
}

const contiguousBounds: LngLatBoundsLike = [
  -125.3321, 23.8991, -65.7421, 49.4325,
];
const alaskaBounds: LngLatBoundsLike = [
  -180, 50.5134265, -128.3203125, 71.3604977,
];
const hawaiiBounds: LngLatBoundsLike = [
  -163.0371094, 16.5098328, -152.1826172, 25.9580447,
];

/**
 * @param searchResult: SolrObject[] is the list of search result
 * @param resetStatus: boolean is the status of 'initial' or 'reset' of the map. If it is 'reset', the map will only show state and county layers
 * @param srChecked: CheckBoxObject[] is the list of spatial checkbox resolution checked by the user
 * @returns
 */
export default function MapArea({
  searchResult,
  highlightIds,
  highlightLyr,
}: {
  searchResult: SolrObject[];
  highlightLyr?: string;
  highlightIds?: string[];
}): JSX.Element {
  const [currentDisplayLayers, setCurrentDisplayLayers] = useState<
    LayerSpecification[]
  >([]);
  const [currentInteractiveLayers, setCurrentInteractiveLayers] = useState<
    LayerSpecification[]
  >([]);
  const [currentResults, setCurrentResults] =
    useState<SolrObject[]>(searchResult);
  const [hoverInfo, setHoverInfo] = useState(null);

  const mapRef = useRef<MapRef>();
  const [mapLoaded, setMapLoaded] = useState(false);

  const params = GetAllParams();

  const [currentZoom, setCurrentZoom] = useState<number>();

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  });
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      const map = mapRef.current.getMap();

      let selectDisplayLayers = new Array<LayerDef>();
      // get all needed interactive layers based on current presented results's spatial resolution
      searchResult.forEach((result) => {
        if (result.meta["spatial_resolution"]) {
          const spatial_res =
            typeof result.meta["spatial_resolution"] === "string"
              ? [result.meta["spatial_resolution"]]
              : result.meta["spatial_resolution"];
          spatial_res.forEach((sr) => {
            const displayLayer = displayLayers.find(
              (d) => d.spec.source === layer_match[sr]
            );
            if (displayLayer)
              selectDisplayLayers = [...selectDisplayLayers, displayLayer];
          });
        }
      });
      // remove duplicates
      let uniqueIds = new Set();
      const newDisplayLayers = selectDisplayLayers.filter((obj) => {
        if (!uniqueIds.has(obj.spec.id)) {
          uniqueIds.add(obj.spec.id);
          return true;
        }
        return false;
      });
      let uniqueInteractiveIds = new Set();

      // Don't use this variable current because we just want the state interactive layer for now
      const newInteractiveLayers = currentInteractiveLayers.filter((obj) => {
        if (!uniqueInteractiveIds.has(obj.id)) {
          uniqueInteractiveIds.add(obj.id);
          return true;
        }
        return false;
      });

      // add all custom sources to the map if not there [Note: if we also want the source to change based on search result, modify this function]
      Object.keys(sources).forEach((id) => {
        if (!map.getSource(id)) map.addSource(id, sources[id]);
      });

      // add navigation control to the map
      const testControl = new maplibregl.NavigationControl({});
      const controls = map._controls;
      const hasNavigationControl = controls.some(
        (control) => control instanceof testControl.constructor
      );
      if (!hasNavigationControl)
        mapRef.current.addControl(testControl, "top-right");

      // if the search result has spatial coverage, add pin to the corresponding location (but no zoom)
      searchResult.forEach((result, index) => {
        if (result.meta["spatial_coverage"]) {
          let spatial_coverages = result.meta["spatial_coverage"];
          if (typeof spatial_coverages === "string")
            spatial_coverages = [spatial_coverages];
          spatial_coverages.forEach((sc) => {
            if (sc.includes(",")) {
              const [countyName, stateName] = sc.split(",");
              const location = getCountyGeo(stateName, countyName);
              let lat = location ? location.lat : 0;
              let lon = location ? location.lng : 0;
              const id = `pin-${lon}-${lat}`;
              if (!map.getSource(id)) {
                map.addSource(id, {
                  type: "geojson",
                  data: {
                    type: "FeatureCollection",
                    features: [
                      {
                        type: "Feature",
                        geometry: {
                          type: "Point",
                          coordinates: [lon, lat],
                        },
                        properties: {
                          title: "County Pin",
                        },
                      },
                    ],
                  },
                });
              }
              // Hide this part because we are not using the circle for now
              // if (!map.getLayer(id)) {
              //   map.addLayer({
              //     id: id,
              //     type: "circle",
              //     source: id,
              //     paint: {
              //       "circle-radius": 5,
              //       "circle-color": "#7E1CC4", // future improvement: pass search result with its color code match to this component and put it here
              //     },
              //   });
              // }
            }
            // Commented out the popup for now, using interactive layers instead in the future
            //   map.on("mouseenter", id, (e) => {
            //     map.getCanvas().style.cursor = "pointer";

            //     const coordinates = (
            //       e.features[0].geometry as any
            //     ).coordinates.slice();
            //     const id = e.features[0]["layer"]["id"];

            //     // new maplibregl.Popup()
            //     //   .setLngLat(coordinates)
            //     //   .setHTML(`<h3>${title}</h3>`)
            //     //   .addTo(map);
            //     const popup = new maplibregl.Popup({ closeOnClick: false })
            //       .setLngLat(coordinates)
            //       .setHTML(`<p>${id}</p>`)
            //       .addTo(map);
            //     map._popup = popup;
            //   });

            //   map.on("mouseleave", id, () => {
            //     map.getCanvas().style.cursor = "";

            //     // const popup = map.getCanvas().querySelector(".maplibregl-popup");
            //     // if (popup) {
            //     //   popup.remove();
            //     // }
            //     if (map._popup) {
            //       map._popup.remove();
            //       map._popup = null;
            //     }
            //   });
            // });
            //}
          });
        }
      });

      // Always add interactive layers as the last layers
      if (map.getLayer("state-interactive") === undefined)
        map.addLayer(
          interactiveLayers.find((i) => i.id === "state-interactive")
        );
    }
  }, [searchResult, mapLoaded]);

  const onHover = useCallback((event) => {
    const feat = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      id: feat && feat.properties.HEROP_ID,
    });
  }, []);

  const onZoomEnd = useCallback(() => {
    const map = mapRef.current.getMap();
    const zoom = map.getZoom();
    const lyrs = params.visLyrs;
    if (zoom <= 6) {
      if (!lyrs.includes("state")) {
        lyrs.push("state");
        params.setVisLyrs(lyrs);
      }
    } else if (zoom <= 10) {
      // set county layer visible
    }
    setCurrentZoom(map.getZoom());
  }, []);

  const onClick = (event: MapLayerMouseEvent) => {
    const feat = event.features[0];
    if (feat) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = feat.properties.BBOX.split(",");
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 1000 }
      );
    }
  };

  const onMoveEnd = (event: ViewStateChangeEvent) => {
    const bounds = event.target.getBounds();
    const newBbox: [number, number, number, number] = [
      Math.round(bounds._sw.lng * 1000) / 1000,
      Math.round(bounds._sw.lat * 1000) / 1000,
      Math.round(bounds._ne.lng * 1000) / 1000,
      Math.round(bounds._ne.lat * 1000) / 1000,
    ];
    params.setBboxParam(newBbox);
  };

  const selectedState = (hoverInfo && hoverInfo.id) || "";
  function getStateFilter(selectedState: string) {
    const f: FilterSpecification = ["in", "HEROP_ID", selectedState];
    return f;
  }
  const filterState = useMemo(
    () => getStateFilter(selectedState),
    [selectedState]
  );

  // these layers for highlighted styles on hover
  const hlStateLyr: LineLayerSpecification = {
    id: "state-highlighted",
    source: "state",
    "source-layer": "state-2018",
    type: "line",
    paint: {
      "line-color": "#FF9C77",
      "line-width": 3,
    },
  };

  // this effect looks at the search params, and if the layers param has changed, it sets
  // the corresponding variable, which will trigger the effect that actually manipulates the map.

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      const map = mapRef.current.getMap();
      const mapLyrIds = map.getStyle().layers.map((lyr) => {
        return lyr.id;
      });

      // add any layers that are in the params but not yet on the map
      params.visLyrs.forEach((lyr) => {
        if (
          layerRegistry[lyr] &&
          !mapLyrIds.includes(layerRegistry[lyr].spec.id)
        ) {
          map.addLayer(layerRegistry[lyr].spec, layerRegistry[lyr].addBefore);
        }
      });

      // iterate layers in registry and remove if not in layers param
      Object.keys(layerRegistry).forEach((lyr) => {
        if (
          mapLyrIds.includes(layerRegistry[lyr].spec.id) &&
          !params.visLyrs.includes(lyr)
        ) {
          map.removeLayer(layerRegistry[lyr].spec.id);
        }
      });
    }
  }, [params.visLyrs, mapLoaded]);

  function makeHighlightLayer(
    spec:
      | FillLayerSpecification
      | LineLayerSpecification
      | CircleLayerSpecification,
    zoom: number
  ) {
    const specHl = structuredClone(spec);
    specHl.id = "result-highlight";
    let lineWidth: number;
    if (zoom <= 5) {
      lineWidth = 0.75;
    } else if (zoom <= 8) {
      lineWidth = 1.25;
    } else if (zoom <= 15) {
      lineWidth = 3;
    } else {
      lineWidth = 5;
    }
    specHl.paint = {
      "line-color": "#7e1cc4",
      "line-width": lineWidth,
    };
    return specHl;
  }

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      const map = mapRef.current.getMap();
      if (map.getLayer("result-highlight") != undefined) {
        map.removeLayer("result-highlight");
      }
      if (highlightLyr) {
        const hlLayer = makeHighlightLayer(
          layerRegistry[highlightLyr].spec,
          map.getZoom()
        );
        map.addLayer(hlLayer);
        if (highlightIds) {
          const hlFilter: FilterSpecification = [
            "in",
            "HEROP_ID",
            ...highlightIds,
          ];
          map.setFilter(hlLayer.id, hlFilter);
        }
      }
    }
  }, [highlightIds, highlightLyr]);

  return (
    <>
      {currentZoom}
      <Map
        id="discoveryMap"
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          bounds: params.bboxParam ? params.bboxParam : contiguousBounds,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="https://api.maptiler.com/maps/3d4a663a-95c3-42d0-9ee6-6a4cce2ba220/style.json?key=bnAOhGDLHGeqBRkYSg8l"
        onMouseMove={onHover}
        onClick={onClick}
        onLoad={() => setMapLoaded(true)}
        onMoveEnd={onMoveEnd}
        interactiveLayerIds={["state-interactive"]}
        onZoomEnd={onZoomEnd}
      >
        {/* adding highlight layer here, to aquire the dynamic filter (maybe this can be done in a more similar pattern to the other layers) */}
        <Layer {...hlStateLyr} filter={filterState} />
        {/* {selectedState && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          closeButton={false}
          className="county-info"
        >
          Id: {selectedState}
        </Popup>
      )} */}
        <ZoomButton label="Contiguous" bounds={contiguousBounds} />
        <ZoomButton label="AK" bounds={alaskaBounds} />
        <ZoomButton label="HI" bounds={hawaiiBounds} />
        <EnableBboxSearchButton />
      </Map>
    </>
  );
}
