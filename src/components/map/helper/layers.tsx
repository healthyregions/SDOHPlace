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

type ClusteredLayerProps = {
  layerId: string,
  sourceId: string,
  sourceLayerId?: string,
  circleColor: string,
  addLabels?: boolean,
  labelColor?: string,
  outlineColor?: string,
}

export const makeClusteredLayerSet = function (props: ClusteredLayerProps) {

  const {
    layerId,
    sourceId,
    sourceLayerId,
    circleColor,
    addLabels = false,
    labelColor = "#000000",
    outlineColor = "#FFFFFF",
  } = props;

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
        'circle-stroke-color': outlineColor,
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
    id: layerId + '-cluster-count',
    type: 'symbol',
    source: sourceId,
    "source-layer": sourceLayerId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 8
    },
    paint: {
      'text-color': labelColor,
    }
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
        'circle-stroke-color': outlineColor,
    }
  }
  const unclusteredLayerDef: LayerDef = {
    addBefore: "Ocean labels",
    spec: unclusteredLayer
  }

  return addLabels ? [clusteredLayerDef, labelLayerDef, unclusteredLayerDef] : [clusteredLayerDef, unclusteredLayerDef]
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
  "Adult Education": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Places related to adult education extracted from Overture Maps Foundation open data.",
    source: {
      id: "us-adult-education-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-adult-education.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-adult-education",
      sourceId: "us-adult-education-source",
      sourceLayerId: "resources",
      circleColor: "#AAAAAA",
    })
  },
  // Airports: {
  //   url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
  //   description: "Thematic extract from Overture Maps Foundation open data.",
  //   source: {
  //     id: "us-airports-source",
  //     spec: {
  //       type: "vector",
  //       url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-airports.pmtiles",
  //     }
  //   },
  //   layers: makeClusteredLayerSet({
  //     layerId: "us-airports",
  //     sourceId: "us-airports-source",
  //     sourceLayerId: "resources",
  //     circleColor: "#BE6DFC",
  //   })
  // },
  "Child Enrichment": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-child-enrichment-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-child-enrichment.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-child-enrichment",
      sourceId: "us-child-enrichment-source",
      sourceLayerId: "resources",
      circleColor: "#95D5FF",
    })
  },
  // "Emissions": {
  //   url: "https://www.epa.gov/air-emissions-inventories/national-emissions-inventory-nei",
  //   description: "Facilities emitting PM2.5, from National Emissions Inventory (NEI)",
  //   source: {
  //     id: "nei-facilities-source",
  //     spec: {
  //       type: "vector",
  //       url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/overlays/nei-facilities.pmtiles",
  //     }
  //   },
  //   layers: makeClusteredLayerSet({
  //     layerId: "nei-facilities",
  //     sourceId: "nei-facilities-source",
  //     sourceLayerId: "resources",
  //     circleColor: "#ff6666",
  //   })
  // },
  "Exercise/Gyms": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-exercise-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-exercise.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-exercise",
      sourceId: "us-exercise-source",
      sourceLayerId: "resources",
      circleColor: "#B769CA",
      labelColor: "#FFFFFF",
    })
  },
  "Libraries": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-libraries-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-libraries.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-libraries",
      sourceId: "us-libraries-source",
      sourceLayerId: "resources",
      circleColor: "#FFDA95",
    })
  },
  Parks: {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-parks-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-parks.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-parks",
      sourceId: "us-parks-source",
      sourceLayerId: "resources",
      circleColor: "#8BC980",
    })
  },
  "Schools": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-schools-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-schools.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-schools",
      sourceId: "us-schools-source",
      sourceLayerId: "resources",
      circleColor: "#D07778",
      labelColor: "#FFFFFF",
    })
  },
  "Supermarkets/Grocery": {
    url: "https://github.com/healthyregions/overture-poi-extract?tab=readme-ov-file#sdoh--place-project-layers",
    description: "Thematic extract from Overture Maps Foundation open data.",
    source: {
      id: "us-grocery-source",
      spec: {
        type: "vector",
        url: "pmtiles://https://raw.githubusercontent.com/healthyregions/overture-poi-extract/v0.0.1/output/us-grocery.pmtiles",
      }
    },
    layers: makeClusteredLayerSet({
      layerId: "us-grocery",
      sourceId: "us-grocery-source",
      sourceLayerId: "resources",
      circleColor: "#5557BE",
      labelColor: "#FFFFFF",
    })
  },
};
