import {
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
  FilterSpecification,
} from "maplibre-gl";

export type LayerDef = {
  addBefore: string;
  spec:
    | FillLayerSpecification
    | LineLayerSpecification
    | CircleLayerSpecification;
};

export const makePreviewLyrs = function (
  id: string,
  source: string,
  filter: FilterSpecification
) {
  const newLineLayerSpec: LineLayerSpecification = {
    id: `${id}-line`,
    source: source,
    "source-layer": source,
    type: "line",
    paint: {
      "line-color": "#FF9C77",
      "line-width": 1,
    },
    filter: filter,
  };
  const newFillLayerSpec: FillLayerSpecification = {
    id: `${id}-fill`,
    source: source,
    "source-layer": source,
    type: "fill",
    paint: {
      "fill-color": "#FF9C77",
      "fill-opacity": 0.1,
    },
    filter: filter,
  };
  return [newLineLayerSpec, newFillLayerSpec];
};

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
