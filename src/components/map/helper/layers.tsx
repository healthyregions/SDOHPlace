import { LayerSpecification } from "maplibre-gl";
// SR: City
const placeLyr: LayerSpecification = {
  id: "place-2018",
  source: "place",
  "source-layer": "place-2018",
  type: "fill",
  paint: {
    "fill-color": "#a05a18",
    "fill-opacity": 0.5,
  },
};
// SR: Zip Code Tabulation Area (ZCTA)
const zctaLyr: LayerSpecification = {
  id: "zcta-2018",
  source: "zcta",
  "source-layer": "zcta-2018",
  type: "line",
  paint: {
    "line-color": "#aeaeae",
    "line-width": 0.25,
  },
};
// SR: Census Block Group
const bgLyr: LayerSpecification = {
  id: "bg-2018",
  source: "bg",
  "source-layer": "bg-2018",
  type: "line",
  paint: {
    "line-color": "#770725",
    "line-width": 0.75,
  },
};
// SR: Census Tract
const tractLyr: LayerSpecification = {
  id: "tract-2018",
  source: "tract",
  "source-layer": "tract-2018",
  type: "line",
  paint: {
    "line-color": "#0f3142",
    "line-width": 1,
  },
};
// SR: County
const countyLyr: LayerSpecification = {
  id: "county-2018",
  source: "county",
  "source-layer": "county-2018",
  type: "line",
  paint: {
    "line-color": "lightgray",
    "line-width": 1.1,
  },
};
// Make it always there
const stateLyr: LayerSpecification = {
  id: "state-2018",
  source: "state",
  "source-layer": "state-2018",
  type: "line",
  paint: {
    "line-color": "#CCC",
    "line-width": 1.75,
  },
};

export const displayLayers = [
  placeLyr,
  zctaLyr,
  bgLyr,
  tractLyr,
  countyLyr,
  stateLyr,
];

// use FillLayers for interactive layers (selection based on interior of polygons)
// because with DisplayLayers, selection/interaction is only on the lines themselves
const stateInteractive: LayerSpecification = {
  id: "state-interactive",
  source: "state",
  "source-layer": "state-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};
const countyInteractive: LayerSpecification = {
  id: "county-interactive",
  source: "county",
  "source-layer": "county-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};
const placeInteractive: LayerSpecification = {
  id: "place-interactive",
  source: "place",
  "source-layer": "place-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};
const zctaInteractive: LayerSpecification = {
  id: "zcta-interactive",
  source: "zcta",
  "source-layer": "zcta-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};
const bgInteractive: LayerSpecification = {
  id: "bg-interactive",
  source: "bg",
  "source-layer": "bg-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};
const tractInteractive: LayerSpecification = {
  id: "tract-interactive",
  source: "tract",
  "source-layer": "tract-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0
  },
};

export const interactiveLayers = [
  stateInteractive,
  countyInteractive,
  placeInteractive,
  zctaInteractive,
  bgInteractive,
  tractInteractive,
];