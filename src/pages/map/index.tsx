"use client";
import type { NextPage } from "next";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Map,
  MapRef,
  useMap,
  MapLayerMouseEvent,
  Popup,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { LayerSpecification, FilterSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

import { stateInteractive, displayLayers } from "../../components/map/layers";
import { sources } from "../../components/map/sources";

// Use LineLayers for the default display of boundary features.

// just an example construction (see upper left corner of map)
function NavigateButton() {
  const { current: map } = useMap();

  const onClick = () => {
    map.flyTo({ center: [-122.4, 37.8] });
  };

  return (
    <button style={{ zIndex: 1, position: "fixed" }} onClick={onClick}>
      Go
    </button>
  );
}

const MapPage: NextPage = () => {
  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const feat = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      id: feat && feat.properties.HEROP_ID,
    });
  }, []);

  const mapRef = useRef<MapRef>();

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
  const hlStateLyr: LayerSpecification = {
    id: "state-highlighted",
    source: "state",
    "source-layer": "state-2018",
    type: "line",
    paint: {
      "line-color": "#8e0850",
      "line-width": 3,
    },
  };

  const onLoad = () => {
    // add all custom sources to the map
    Object.keys(sources).forEach((id) => {
      mapRef.current.getMap().addSource(id, sources[id]);
    });

    // add these layers before the "Ocean labels" layer (which is already present
    // in the default mapstyle). This allows labels to overlap the boundaries.
    displayLayers.forEach((lyr) => {
      const addBefore = lyr.id == "place-2018" ? "Forest" : "Ocean labels";
      mapRef.current.getMap().addLayer(lyr, addBefore);
    });

    // add selectable state layer to the map (this is linked to 'interactiveLayerIds' in the Map object)
    mapRef.current.getMap().addLayer(stateInteractive, "Ocean labels");
  };

  return (
    <>
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: -103,
          latitude: 43,
          zoom: 4,
        }}
        style={{
          width: "100%",
          height: "100vh",
        }}
        mapStyle="https://api.maptiler.com/maps/dataviz/style.json?key=bnAOhGDLHGeqBRkYSg8l"
        onMouseMove={onHover}
        onClick={onClick}
        onLoad={onLoad}
        interactiveLayerIds={["state-interactive"]}
      >
        {/* adding highlight layer here, to aquire the dynamic filter (maybe this can be done in a more similar pattern to the other layers) */}
        <Layer {...hlStateLyr} beforeId="Ocean labels" filter={filterState} />
        {selectedState && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            className="county-info"
          >
            Id: {selectedState}
          </Popup>
        )}
        <NavigateButton />
      </Map>
    </>
  );
};

export default MapPage;
