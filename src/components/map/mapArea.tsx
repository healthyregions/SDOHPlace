"use client";
import { useEffect, useState } from "react";
import { LngLatBoundsLike } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { SolrObject } from "meta/interface/SolrObject";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./dynamicMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />,
});

interface Props {
  resultsList: SolrObject[];
  highlightLyr?: string;
  highlightIds?: string[];
}

export default function MapArea(props: Props): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const contiguousBounds: LngLatBoundsLike = [
    -125.3321, 23.8991, -65.7421, 49.4325,
  ];
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <div className="h-full w-full bg-gray-100" />;
  }
  return (
    <div className="h-full w-full relative">
      <DynamicMap initialBounds={contiguousBounds} />
    </div>
  );
}
