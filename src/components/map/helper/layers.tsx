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

export const makeClusteredLayerSet = function (props: {
  layerId: string,
  sourceId: string,
  sourceLayerId?: string,
  circleColor: string,
}) {

  const clusteredLayer: CircleLayerSpecification = {
    id: props.layerId + "-clusters",
    source: props.sourceId,
    "source-layer": props.sourceLayerId,
    type: "circle",
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': props.circleColor,
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
  // if (props.sourceLayerId) {clusteredLayer["source-layer"] = props.sourceLayerId}
  const clusteredLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: clusteredLayer
  }

  const labelLayer: SymbolLayerSpecification = {
    id: props.layerId + '-cluster-count',
    type: 'symbol',
    source: props.sourceId,
    "source-layer": props.sourceLayerId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 8
    },
    // paint: {
    //   'text-color': "#ffffff",
    // }
  }
  // if (props.sourceLayerId) {clusteredLayer["source-layer"] = props.sourceLayerId}
  const labelLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: labelLayer
  }

  const unclusteredLayer: CircleLayerSpecification = {
    id: props.layerId + '-unclustered',
    type: 'circle',
    source: props.sourceId,
    "source-layer": props.sourceLayerId,
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': props.circleColor,
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
  // ParksOld: {
  //   source: {
  //     id: "la-restaurants-source",
  //     spec: {
  //       // type: "vector",
  //       // url: "pmtiles://http://localhost:8080/la-parks-clustered.pmtiles",
  //       type: "geojson",
  //       data: "http://localhost:8080/us-parks.geojson",
  //       cluster: true,
  //       clusterMaxZoom: 14, // Max zoom to cluster points on
  //       clusterRadius: 50
  //     }
  //   },
  //   layers: makeClusteredLayerSet({
  //     layerId: "la-restaurants",
  //     sourceId: "la-restaurants-source",
  //     // sourceLayerId: "resources",
  //     circleColor: "#24e8c8",
  //   })
  // },
  Parks: {
    url: "https://overturemaps.org/",
    description: "Parks from Overture Points of Interests dataset",
    source: {
      id: "la-parks-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/overlays/us-parks-overture.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "la-parks",
      sourceId: "la-parks-source",
      sourceLayerId: "resources",
      circleColor: "#24e8c8",
    })
  },
  "NEI Facilities": {
    url: "https://www.epa.gov/air-emissions-inventories/national-emissions-inventory-nei",
    description: "Facilities emitting PM2.5, from National Emissions Inventory (NEI)",
    source: {
      id: "nei-facilities-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/overlays/nei-facilities.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "nei-facilities",
      sourceId: "nei-facilities-source",
      sourceLayerId: "resources",
      circleColor: "#ff6666",
    })
  },
};
