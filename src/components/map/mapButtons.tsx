"use client";
import { useMap, LngLatBoundsLike } from "react-map-gl/maplibre";
import {
  GetAllParams,
  reGetFilterQueries,
} from "../search/helper/ParameterList";

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
    map.fitBounds(bounds);
  };

  return (
    <button onClick={onClick} className={mapButtonStyle}>
      {label}
    </button>
  );
}

interface EnableBboxSearchButtonProps {
  handleSearch: (
    params: any,
    currentQuery: string,
    filterQueries: string[]
  ) => void;
}
export function EnableBboxSearchButton({ handleSearch }: EnableBboxSearchButtonProps) {
  const params = GetAllParams();
  return (
    <div className={`${mapButtonStyle} inline`}>
      <label>
        <input
          type="checkbox"
          checked={params.bboxSearch}
          onChange={(e) => {
            if (e.target.checked) {
              params.setBboxSearch(true);
              const currentQuery = params.query ? params.query : "*";
              const filterQueries = reGetFilterQueries(params);
              filterQueries.push({ attribute: "bboxSearch", value: "true" });
              console.log("FilterQueries now:", filterQueries);
              if (params.bboxParam)
                handleSearch(params, currentQuery, filterQueries);
            } else {
              params.setBboxSearch(null);
            }
          }}
        />
        &nbsp;Search this area
      </label>
    </div>
  );
}
