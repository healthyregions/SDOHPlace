"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Map,
  MapRef,
  NavigationControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  Popup,
  Layer,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import maplibregl, {
  FilterSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import { sources } from "./helper/sources";
import { AppDispatch, RootState } from "@/store";
import { setBboxParam, setVisLyrs } from "@/store/slices/searchSlice";
import "maplibre-gl/dist/maplibre-gl.css";
import { overlayRegistry, layerRegistry } from "./helper/layers";
import DynamicMapButtons from "./dynamicMapButtons";

interface Props {
  initialBounds: LngLatBoundsLike;
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

export default function DynamicMap(props: Props): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { bboxParam, bboxSearch, visLyrs, visOverlays } = useSelector(
    (state: RootState) => state.search
  );
  const [currentDisplayLayers, setCurrentDisplayLayers] = useState<
    LayerSpecification[]
  >([]);
  const [currentInteractiveLayers, setCurrentInteractiveLayers] = useState<
    LayerSpecification[]
  >([]);
  const [parkPopupInfo, setParkPopupInfo] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>();
  const mapRef = useRef<MapRef>(null);

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
    Object.keys(sources).forEach((id) => {
      if (!map.getSource(id)) map.addSource(id, sources[id]);
    });
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
    visLyrs.forEach((lyr) => {
      if (
        layerRegistry[lyr] &&
        !mapLyrIds.includes(layerRegistry[lyr].spec.id)
      ) {
        map.addLayer(layerRegistry[lyr].spec, layerRegistry[lyr].addBefore);
      }
    });
    Object.keys(layerRegistry).forEach((lyr) => {
      if (
        mapLyrIds.includes(layerRegistry[lyr].spec.id) &&
        !visLyrs.includes(lyr)
      ) {
        map.removeLayer(layerRegistry[lyr].spec.id);
      }
    });
  }, [visLyrs, visOverlays, mapLoaded]);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const parkFeat = event.features?.find((f) => f["source"] === "us-parks");
    const stateFeat = event.features?.find((f) => f["source"] === "state");

    setSelectedState(stateFeat ? stateFeat.properties.HEROP_ID : "");

    if (!mapRef.current) return;

    mapRef.current.getMap().getCanvas().style.cursor = parkFeat
      ? "pointer"
      : "grab";
    setParkPopupInfo(
      parkFeat
        ? {
            longitude: parkFeat.geometry["coordinates"][0],
            latitude: parkFeat.geometry["coordinates"][1],
            name: parkFeat.properties.name,
          }
        : null
    );
  }, []);

  const onZoomEnd = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const zoom = map.getZoom();
    setCurrentZoom(zoom);

    const newVisLyrs = [...visLyrs];
    if (zoom <= 6 && !newVisLyrs.includes("state")) {
      newVisLyrs.push("state");
      dispatch(setVisLyrs(newVisLyrs));
    }
  }, [visLyrs, dispatch]);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feat = event.features?.[0];
    if (feat?.properties.BBOX) {
      const [minLng, minLat, maxLng, maxLat] = feat.properties.BBOX.split(",");
      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 40,
          duration: 1000,
        }
      );
    }
  }, []);

  const onMoveEnd = useCallback(
    (event: ViewStateChangeEvent) => {
      const bounds = event.target.getBounds();
      const newBbox: [number, number, number, number] = [
        Math.round(bounds._sw.lng * 1000) / 1000,
        Math.round(bounds._sw.lat * 1000) / 1000,
        Math.round(bounds._ne.lng * 1000) / 1000,
        Math.round(bounds._ne.lat * 1000) / 1000,
      ];
      dispatch(setBboxParam(newBbox));
    },
    [dispatch]
  );

  const filterState = useMemo(
    () => ["in", "HEROP_ID", selectedState] as FilterSpecification,
    [selectedState]
  );

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

  return (
    <Map
      id="discoveryMap"
      ref={mapRef}
      mapLib={maplibregl}
      initialViewState={{
        bounds: props.initialBounds,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://api.maptiler.com/maps/3d4a663a-95c3-42d0-9ee6-6a4cce2ba220/style.json?key=bnAOhGDLHGeqBRkYSg8l"
      onMouseMove={onHover}
      onClick={onClick}
      onLoad={() => setMapLoaded(true)}
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
      interactiveLayerIds={["state-interactive", "us-parks"]}
    >
      <NavigationControl position="top-right" />
      <Layer {...hlStateLyr} filter={filterState} />
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
      <DynamicMapButtons mapRef={mapRef} />
    </Map>
  );
}
