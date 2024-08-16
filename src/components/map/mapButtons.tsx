"use client";
import { useMap, LngLatBoundsLike } from "react-map-gl/maplibre";
import { poiLayer } from "./helper/layers";
import { parseAsBoolean, useQueryState } from "nuqs";

const mapButtonStyle =
  "mt-4 ml-4 text-almostblack py-1 px-2 border-strongorange rounded border relative z-1 font-sans text-base bg-lightbisque";

export function ZoomButton({
  label,
  bounds,
}: {
  label: string;
  bounds: LngLatBoundsLike;
}) {
  const { current: map } = useMap();

  const onClick = () => {
    if (map.getMap().getLayer(poiLayer.spec.id)) {
      map.getMap().removeLayer(poiLayer.spec.id);
    } else {
      map.getMap().addLayer(poiLayer.spec, poiLayer.addBefore);
    }
    map.fitBounds(bounds);
  };

  return (
    <button onClick={onClick} className={mapButtonStyle}>
      {label}
    </button>
  );
}

export function EnableBboxSearchButton() {
  const [bboxSearch, setBboxSearch] = useQueryState(
    "bboxSearch",
    parseAsBoolean.withDefault(false)
  );

  return (
    <div className={`${mapButtonStyle} inline`}>
      <label>
        <input
          type="checkbox"
          checked={bboxSearch}
          onChange={(e) => {
            e.target.checked ? setBboxSearch(true) : setBboxSearch(null);
          }}
        />
        &nbsp;Search this area
      </label>
    </div>
  );
}
