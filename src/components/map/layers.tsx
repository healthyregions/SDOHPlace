import { LayerSpecification } from "maplibre-gl";

const zctaLyr: LayerSpecification = {
  id: "zcta-2018",
  source: "zcta",
  "source-layer": "zcta-2018",
  type: "line",
  paint: {
    "line-color": "#ff0",
    "line-width": 0.5,
  },
};
const bgLyr: LayerSpecification = {
  id: "bg-2018",
  source: "bg",
  "source-layer": "bg-2018",
  type: "line",
  paint: {
    "line-color": "#003",
    "line-width": 0.5,
  },
};
const tractLyr: LayerSpecification = {
  id: "tract-2018",
  source: "tract",
  "source-layer": "tract-2018",
  type: "line",
  paint: {
    "line-color": "#030",
    "line-width": 0.75,
  },
};
const countyLyr: LayerSpecification = {
  id: "county-2018",
  source: "county",
  "source-layer": "county-2018",
  type: "line",
  paint: {
    "line-color": "#700",
    "line-width": 1,
  },
};
const stateLyr: LayerSpecification = {
  id: "state-2018",
  source: "state",
  "source-layer": "state-2018",
  type: "line",
  paint: {
    "line-color": "#3e3e3e",
    "line-width": 1.5,
  },
};

export const displayLayers = [zctaLyr, bgLyr, tractLyr, countyLyr, stateLyr];

// use FillLayers for selectable layers (selection based on interior of polygons)
// because with LineLayers, selection/interaction is only on the lines themselves
export const stateSelectable: LayerSpecification = {
  id: "state-selectable",
  source: "state",
  "source-layer": "state-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
