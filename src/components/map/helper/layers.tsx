import {
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
  FilterSpecification,
} from "maplibre-gl";

export type LayerDef = {
  addBefore: string;
  spec: FillLayerSpecification | LineLayerSpecification | CircleLayerSpecification;
};

export const makePreviewLyr = function (id: string, source: string, filter: FilterSpecification) {
  const newLayerSpec: LineLayerSpecification = {
    "id": id,
    "source": source,
    "source-layer": source,
    "type": "line",
    "paint": {
      "line-color": "#FF9C77",
      "line-width": 1,
    },
    "filter": filter,
  };
  const outLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: newLayerSpec,
  };
  return outLayerDef
}

// demo POI layer
const parksSpec: CircleLayerSpecification = {
  id: "us-parks",
  source: "us-parks",
  "source-layer": "resources",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": "#1FBCA3",
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 1,
  },
};

export const parksLayer: LayerDef = {
  addBefore: "Ocean labels",
  spec: parksSpec,
};

export const overlayRegistry = {
  Parks: parksLayer,
};
