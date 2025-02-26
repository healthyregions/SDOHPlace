"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Map,
  MapRef,
  NavigationControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  Popup,
  LngLatBoundsLike,
  Source,
} from "react-map-gl/maplibre";
import maplibregl, {
  FilterSpecification,
  LineLayerSpecification,
  GeoJSONSource,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import { overlaySources } from "./helper/sources";
import { AppDispatch, RootState } from "@/store";
import { setBbox } from "@/store/slices/searchSlice";
import "maplibre-gl/dist/maplibre-gl.css";
import { overlayRegistry, makePreviewLyrs } from "./helper/layers";

import "@maptiler/geocoding-control/style.css";

import * as turf from "@turf/turf";

import GeoSearchControl from "./geoSearchControl";
import { clearMapPreview } from "@/store/slices/uiSlice";
import {EventType} from "@/lib/event";
import {usePlausible} from "next-plausible";

const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

interface Props {
  initialBounds: LngLatBoundsLike;
}

export default function DynamicMap(props: Props): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const { bbox, visOverlays } = useSelector((state: RootState) => state.search);
  const mapPreview = useSelector((state: RootState) => state.ui.mapPreview);
  const [parkPopupInfo, setParkPopupInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current.getMap();
    map.getStyle().layers.map((lyr) => {
      if (lyr.id.startsWith("herop-")) {
        map.removeLayer(lyr.id);
      }
    });

    const lookup = {
      "040": "state-2018",
      "050": "county-2018",
      "140": "tract-2018",
      "150": "bg-2018",
      "860": "zcta-2018",
    };
    mapPreview.map((previewLyr) => {
      // Just look at first id here (we shouldn't see minus mixed with non-minus)
      const firstId = previewLyr.filterIds[0];
      const source = firstId.startsWith("-")
        ? lookup[firstId.slice(1, 4)]
        : lookup[firstId.slice(0, 3)];
      const operator = firstId.startsWith("-") ? "all" : "any";
      let clauses: FilterSpecification[] = [];
      previewLyr.filterIds.forEach((id: string) => {
        if (id.startsWith("-") && id.endsWith("*")) {
          // Wildcard excludes - exclude any IDs that match the wildcard if it starts with "-"
          clauses.push([
            "!=",
            ["slice", ["get", "HEROP_ID"], 0, id.length - 2],
            id.slice(1, -1),
          ]);
        } else if (id.startsWith("-") && !id.endsWith("*")) {
          // Excludes - exclude any IDs that start with "-"
          clauses.push(["!=", ["get", "HEROP_ID"], id.slice(1, id.length)]);
        } else if (!id.startsWith("-") && id.endsWith("*")) {
          // Wildcards - "*" on the end works as a wildcard match
          clauses.push([
            "==",
            ["slice", ["get", "HEROP_ID"], 0, id.length - 1],
            id.slice(0, -1),
          ]);
        } else {
          // Other values are exact matches
          // These are handled below in bulk
        }
      });

      // Other values are exact matches
      const exactMatches = previewLyr.filterIds.filter(
        (id: string) => !id.startsWith("-") && !id.endsWith("*")
      );
      if (exactMatches.length) {
        clauses.push(["in", ["get", "HEROP_ID"], ["literal", exactMatches]]);
      }

      const expression = [operator, ...clauses];
      console.log(expression);

      const previewLyrs = makePreviewLyrs(
        previewLyr.lyrId,
        source,
        expression as any
      );
      previewLyrs.forEach((lyr) => {
        map.addLayer(lyr, "Ocean labels");
      });
    });
  }, [mapPreview, mapLoaded]);

  // create ability to load pmtiles layers
  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current.getMap();
    const mapLyrIds = map.getStyle().layers.map((lyr) => lyr.id);

    visOverlays.forEach((lyr) => {
      if (
        overlayRegistry[lyr] &&
        !mapLyrIds.includes(overlayRegistry[lyr].spec.id)
      ) {
        map.addLayer(overlayRegistry[lyr].spec, overlayRegistry[lyr].addBefore);
      }
    });

    Object.keys(overlayRegistry).forEach((lyr) => {
      if (
        mapLyrIds.includes(overlayRegistry[lyr].spec.id) &&
        !visOverlays.includes(lyr)
      ) {
        map.removeLayer(overlayRegistry[lyr].spec.id);
      }
    });
  }, [visOverlays, mapLoaded]);

  const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current.getMap();
    const parkFeat = event.features?.find((f) => f["source"] === "us-parks");

    if (parkFeat) {
      map.getCanvas().style.cursor = "pointer";
      setParkPopupInfo({
        longitude: parkFeat.geometry["coordinates"][0],
        latitude: parkFeat.geometry["coordinates"][1],
        name: parkFeat.properties.name,
      });
    } else {
      map.getCanvas().style.cursor = "grab";
      setParkPopupInfo(null);
    }
  }, []);

  const onLoad = useCallback(() => {
    const map = mapRef.current.getMap();

    // add all custom sources to the map
    Object.keys(overlaySources).forEach((id) => {
      map.addSource(id, overlaySources[id]);
    });

    map.addSource("geoSearchHighlight", { type: "geojson", data: null });
    map.addLayer({
      id: "geoSearchHighlightLyr-fill",
      type: "fill",
      source: "geoSearchHighlight",
      paint: {
        "fill-color": "#000",
        "fill-opacity": 0.1,
      },
    });
    map.addLayer({
      id: "geoSearchHighlightLyr-line",
      type: "line",
      source: "geoSearchHighlight",
      paint: {
        "line-width": ["case", ["==", ["geometry-type"], "Polygon"], 2, 3],
        "line-dasharray": [1, 1],
        "line-color": "#FF9C77",
      },
    });

    setMapLoaded(true);
  }, []);

  const setBboxOnMoveEnd = useCallback(
    (event: ViewStateChangeEvent) => {
      const bounds = event.target.getBounds();
      const newBbox: [number, number, number, number] = [
        Math.round(bounds._sw.lng * 1000) / 1000,
        Math.round(bounds._sw.lat * 1000) / 1000,
        Math.round(bounds._ne.lng * 1000) / 1000,
        Math.round(bounds._ne.lat * 1000) / 1000,
      ];
      dispatch(setBbox(newBbox));
    },
    [dispatch]
  );

  const handleGeoSearchSelection = useCallback(
    (e) => {
      dispatch(clearMapPreview());
      const map = mapRef.current.getMap();
      const highlightSource = map.getSource(
        "geoSearchHighlight"
      ) as GeoJSONSource;
      if (
        e.feature &&
        (e.feature.geometry.type == "MultiPolygon" ||
          e.feature.geometry.type == "Polygon")
      ) {
        let feat = turf.feature(e.feature.geometry);
        let diffGeom = turf.difference(
          turf.featureCollection([
            turf.polygon([
              [
                [180, 90],
                [-180, 90],
                [-180, -90],
                [180, -90],
                [180, 90],
              ],
            ]),
            feat,
          ])
        );
        highlightSource.setData(diffGeom);
      } else {
        highlightSource.setData({ type: "FeatureCollection", features: [] });
      }
      if (e.feature) {
        map.on("moveend", setBboxOnMoveEnd);
      } else {
        map.off("moveend", setBboxOnMoveEnd);
        dispatch(setBbox(null));
      };

      if (e?.feature?.properties) {
        plausible(EventType.SubmittedLocationSearch, {
          props: {
            ...e.feature.properties
          }
        });
      }
    },
    [dispatch]
  );

  return (
    <Map
      id="discoveryMap"
      ref={mapRef}
      mapLib={maplibregl}
      initialViewState={{
        bounds: props.initialBounds,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/3d4a663a-95c3-42d0-9ee6-6a4cce2ba220/style.json?key=${apiKey}`}
      onMouseMove={onMouseMove}
      onLoad={onLoad}
      dragRotate={false}
      touchPitch={false}
      touchZoomRotate={false}
      interactiveLayerIds={["state-interactive", "us-parks"]}
    >
      <Source
        id="state-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/state-2018.pmtiles"
      />
      <Source
        id="county-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/county-2018.pmtiles"
      />
      <Source
        id="tract-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/tract-2018.pmtiles"
      />
      <Source
        id="bg-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/bg-2018.pmtiles"
      />
      <Source
        id="zcta-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/zcta-2018.pmtiles"
      />
      <Source
        id="place-2018"
        type="vector"
        url="pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/place-2018.pmtiles"
      />

      <NavigationControl position="top-right" showCompass={false} />
      <GeoSearchControl
        apiKey={apiKey}
        position="top-left"
        selectionCallback={handleGeoSearchSelection}
      />
      {parkPopupInfo && (
        <Popup
          longitude={parkPopupInfo.longitude}
          latitude={parkPopupInfo.latitude}
          closeButton={false}
          className="county-info"
        >
          {parkPopupInfo.name}
        </Popup>
      )}
      {bbox && mapLoaded && (
        <div
          className={`mt-[54px] ml-[10px] text-almostblack py-1 px-2 rounded relative font-sans text-sm bg-white bg-opacity-75 inline-flex`}
        >
          <span>
            results filtered by current map extent
          </span>
        </div>
      )}
    </Map>
  );
}
