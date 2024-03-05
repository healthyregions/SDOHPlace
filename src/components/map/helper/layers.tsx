import { LayerSpecification } from "maplibre-gl";

const placeLyr: LayerSpecification = {
  id: "place-2018",
  source: "place",
  "source-layer": "place-2018",
  type: "fill",
  paint: {
    "fill-color": "#a05a18",
    "fill-opacity": 0.25,
  },
};
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
const countyLyr: LayerSpecification = {
  id: "county-2018",
  source: "county",
  "source-layer": "county-2018",
  type: "line",
  paint: {
    "line-color": "#373737",
    "line-width": 1.1,
  },
};
const stateLyr: LayerSpecification = {
  id: "state-2018",
  source: "state",
  "source-layer": "state-2018",
  type: "line",
  paint: {
    "line-color": "#141414",
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
// because with LineLayers, selection/interaction is only on the lines themselves
export const stateInteractive: LayerSpecification = {
  id: "state-interactive",
  source: "state",
  "source-layer": "state-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
