// these are the sources for all overlay layers. multiple layers can be added to the map
// that use the same source: for example a source for state boundaries can be displayed as a
// polygon (fill) layer as well as a line (outline) layer
export const overlaySources = {
  "us-parks": {
    type: "vector",
    url: "pmtiles://https://herop-geodata.s3.us-east-2.amazonaws.com/sdohplace/overlays/us-parks.pmtiles",
  },
};
