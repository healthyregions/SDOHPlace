import data from "./ks-parks-example.json";

// these are the sources for all overlay layers. multiple layers can be added to the map
// that use the same source: for example a source for state boundaries can be displayed as a
// polygon (fill) layer as well as a line (outline) layer
export const sources = {
  state: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/state-2018.pmtiles",
  },
  county: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/county-2018.pmtiles",
  },
  tract: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/tract-2018.pmtiles",
  },
  bg: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/bg-2018.pmtiles",
  },
  zcta: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/zcta-2018.pmtiles",
  },
  place: {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/place-2018.pmtiles",
  },
  "us-parks": {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/overlays/us-parks.pmtiles",
  },
};
