import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SolrObject } from "meta/interface/SolrObject";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";

("use client");
import type { NextPage } from "next";
import {
  Map,
  MapRef,
  useMap,
  MapLayerMouseEvent,
  Popup,
  Source,
  Layer,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { LayerSpecification, FilterSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

import {
  stateInteractive,
  displayLayers,
} from "../../components/map/helper/layers";
import { sources } from "../../components/map/helper/sources";

const statesBounds: LngLatBoundsLike = [-125.3321, 23.8991, -65.7421, 49.4325];
const alaskaBounds: LngLatBoundsLike = [
  -180, 50.5134265, -128.3203125, 71.3604977,
];
const hawaiiBounds: LngLatBoundsLike = [
  -163.0371094, 16.5098328, -152.1826172, 25.9580447,
];
const bounds = {
  states: statesBounds,
  alaska: alaskaBounds,
  hawaii: hawaiiBounds,
};
// {
//     results,
//     isLoading,
//     filterAttributeList,
//   }: {
//     results: SolrObject[];
//     isLoading: boolean;
//     filterAttributeList: {
//       attribute: string;
//       displayName: string;
//     }[];
//   }
// just an example construction (see upper left corner of map)
function NavigateButton({
  label,
  bounds,
}: {
  label: string;
  bounds: LngLatBoundsLike;
}) {
  const { current: map } = useMap();

  const onClick = () => {
    map.fitBounds(bounds);
  };

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "black",
        margin: "15px",
        fontSize: "1.5em",
        padding: "5px",
        color: "white",
        zIndex: 1,
        position: "relative",
      }}
    >
      {label}
    </button>
  );
}

export default function MapArea(): JSX.Element {
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
    <div style={{ height: "calc(100vh - 172px" }}>
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          bounds: bounds.states,
        }}
        style={{
          width: "100%",
          height: "100%",
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
        <NavigateButton label="[]" bounds={bounds.states} />
        <NavigateButton label="AK" bounds={bounds.alaska} />
        <NavigateButton label="HI" bounds={bounds.hawaii} />
      </Map>
    </div>
  );
}
