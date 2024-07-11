import {
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
} from "maplibre-gl";

// Important note: Before we used "LayerSpecification" but this was too generic
// to pass our pre-commit hooks, after it was used as the nested spec property type
// within the LayerDef type. Specifically, it failed because in some places the source property
// is referenced, and on BackgroundLayerSpecification this property does not exist.

// It is better to use more specific types here anyway, so prefer this use of
// FillLayerSpecification, LineLayerSpecification etc.

export type LayerDef = {
  addBefore: string | null;
  spec:
    | FillLayerSpecification
    | LineLayerSpecification
    | CircleLayerSpecification
    | null;
};

// SR: City
const placeSpec: FillLayerSpecification = {
  id: "place-2018",
  source: "place",
  "source-layer": "place-2018",
  type: "fill",
  paint: {
    "fill-color": "#a05a18",
    "fill-opacity": 0.5,
  },
};
const placeLyr: LayerDef = {
  addBefore: "Landcover",
  spec: placeSpec,
};

// SR: Zip Code Tabulation Area (ZCTA)
const zctaSpec: LineLayerSpecification = {
  id: "zcta-2018",
  source: "zcta",
  "source-layer": "zcta-2018",
  type: "line",
  paint: {
    "line-color": "#aeaeae",
    "line-width": 0.25,
  },
};
const zctaLyr: LayerDef = {
  addBefore: "Ocean labels",
  spec: zctaSpec,
};

// SR: Census Block Group
const bgSpec: LineLayerSpecification = {
  id: "bg-2018",
  source: "bg",
  "source-layer": "bg-2018",
  type: "line",
  paint: {
    "line-color": "#ff9c77",
    "line-width": 0.75,
  },
};
const bgLyr: LayerDef = {
  addBefore: "Ocean labels",
  spec: bgSpec,
};

// SR: Census Tract
const tractSpec: LineLayerSpecification = {
  id: "tract-2018",
  source: "tract",
  "source-layer": "tract-2018",
  type: "line",
  paint: {
    "line-color": "#9490B6",
    "line-width": 1,
  },
};
const tractLyr: LayerDef = {
  addBefore: "Ocean labels",
  spec: tractSpec,
};

// SR: County
const countySpec: LineLayerSpecification = {
  id: "county-2018",
  source: "county",
  "source-layer": "county-2018",
  type: "line",
  paint: {
    "line-color": "lightgray",
    "line-width": 1.5,
  },
};
const countyLyr: LayerDef = {
  addBefore: "Ocean labels",
  spec: countySpec,
};

// Make it always there
const stateSpec: LineLayerSpecification = {
  id: "state-2018",
  source: "state",
  "source-layer": "state-2018",
  type: "line",
  paint: {
    "line-color": "#CCC",
    "line-width": 2,
  },
};
const stateLyr: LayerDef = {
  addBefore: "Ocean labels",
  spec: stateSpec,
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
const stateInteractive: FillLayerSpecification = {
  id: "state-interactive",
  source: "state",
  "source-layer": "state-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
const countyInteractive: FillLayerSpecification = {
  id: "county-interactive",
  source: "county",
  "source-layer": "county-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
const placeInteractive: FillLayerSpecification = {
  id: "place-interactive",
  source: "place",
  "source-layer": "place-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
const zctaInteractive: FillLayerSpecification = {
  id: "zcta-interactive",
  source: "zcta",
  "source-layer": "zcta-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
const bgInteractive: FillLayerSpecification = {
  id: "bg-interactive",
  source: "bg",
  "source-layer": "bg-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
  },
};
const tractInteractive: FillLayerSpecification = {
  id: "tract-interactive",
  source: "tract",
  "source-layer": "tract-2018",
  type: "fill",
  paint: {
    "fill-opacity": 0,
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

// demo POI layer
const poiSpec: CircleLayerSpecification = {
  id: "pois",
  source: "pois",
  // "source-layer": "pois",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": "#1FBCA3",
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 1,
  },
};

export const poiLayer: LayerDef = {
  addBefore: "Ocean labels",
  spec: poiSpec,
};

export const layerRegistry = {
  state: stateLyr,
  place: placeLyr,
  county: countyLyr,
  bg: bgLyr,
  tract: tractLyr,
  zcta: zctaLyr,
};
