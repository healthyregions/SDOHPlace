import {
  FillLayerSpecification,
  LineLayerSpecification,
  CircleLayerSpecification,
  FilterSpecification,
  SymbolLayerSpecification,
  SourceSpecification,
} from "maplibre-gl";

export type LayerDef = {
  addBefore: string;
  spec:
    | FillLayerSpecification
    | LineLayerSpecification
    | CircleLayerSpecification
    | SymbolLayerSpecification;
};

export const makeClusteredLayerSet = function (
  layerId: string,
  sourceId: string,
  sourceLayerId: string,
  circleColor: string,
) {

  const clusteredLayer: CircleLayerSpecification = {
    id: layerId + "-clusters",
    source: sourceId,
    "source-layer": sourceLayerId,
    type: "circle",
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': circleColor,
        'circle-stroke-width': 1,
        'circle-stroke-color': "#1e1e1e",
        // [
        //     'step',
        //     ['get', 'point_count'],
        //     '#51bbd6',
        //     100,
        //     '#f1f075',
        //     750,
        //     '#f28cb1'
        // ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            8,
            50,
            15,
            100,
            20
        ]
    }
  }
  const clusteredLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: clusteredLayer
  }

  const labelLayer: SymbolLayerSpecification = {
    id: layerId + 'cluster-count',
    type: 'symbol',
    source: sourceId,
    "source-layer": sourceLayerId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    // paint: {
    //   'text-color': "#ffffff",
    // }
  }
  const labelLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: labelLayer
  }

  const unclusteredLayer: CircleLayerSpecification = {
    id: layerId + '-unclustered',
    type: 'circle',
    source: sourceId,
    "source-layer": sourceLayerId,
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': circleColor,
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': "#1e1e1e",
    }
  }
  const unclusteredLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: unclusteredLayer
  }

  return [clusteredLayerDef, labelLayerDef, unclusteredLayerDef]
}

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


export const overlayRegistry = {
  Parks: {
    source: {
      id: "la-restaurants-source",
      spec: {
        type: "vector",
        url: "pmtiles://http://localhost:8080/la-restaurants.pmtiles",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 250
      }
    },
    layers: makeClusteredLayerSet(
      "la-restaurants",
      "la-restaurants-source",
      "resources",
      "#24e8c8",
    )
  } ,
};
