"use client";
import { useControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeocodingControl } from "@maptiler/geocoding-control/maplibregl";
import "@maptiler/geocoding-control/style.css";

interface GeoSearchControlProps {
  apiKey: string;
  position: any;
  selectionCallback: any;
}

export default function GeoSearchControl(props: GeoSearchControlProps) {
  const gc = new GeocodingControl({
    apiKey: props.apiKey,
    country: "us",
    types: ["region", "county", "postal_code", "municipality"],
    marker: false,
    markerOnSelected: false,
    showResultMarkers: false,
    fullGeometryStyle: null,
    placeholder: "Filter by state, county, city, or zip",
    noResultsMessage: "No matching locations found...",
    class: "geosearch-control",
  });
  gc.on("pick", props.selectionCallback);
  useControl(() => gc, {
    position: props.position,
  });
  return null;
}