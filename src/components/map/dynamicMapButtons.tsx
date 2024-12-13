"use client";
import { useCallback } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setBboxParam, setBboxSearch } from "@/store/slices/searchSlice";
import { MapRef } from "react-map-gl/maplibre";

const mapButtonStyle =
  "mt-4 ml-4 text-almostblack py-1 px-2 border-strongorange rounded border relative z-10 font-sans text-base bg-lightbisque";

const contiguousBounds = [-125.3321, 23.8991, -65.7421, 49.4325];
const alaskaBounds = [-180, 50.5134265, -128.3203125, 71.3604977];
const hawaiiBounds = [-163.0371094, 16.5098328, -152.1826172, 25.9580447];

interface Props {
  mapRef: React.RefObject<MapRef>;
}

export default function DynamicMapButtons(props: Props): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const bboxSearch = useSelector((state: RootState) => state.search.bboxSearch);
  const handleZoom = useCallback(
    (bounds: number[]) => {
      if (!props.mapRef.current) return;

      props.mapRef.current.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        {
          padding: 40,
          duration: 1000,
        }
      );
      dispatch(setBboxParam(bounds));
    },
    [props.mapRef, dispatch]
  );
  const handleBboxSearchChange = useCallback(
    (checked: boolean) => {
      // uncheck means to reset the bbox param
      if (!checked) dispatch(setBboxParam([]));
      dispatch(setBboxSearch(checked));
    },
    [dispatch]
  );
  return (
    <div className="relative top-0 left-0 z-0 flex items-center">
      <button
        onClick={() => handleZoom(contiguousBounds)}
        className={mapButtonStyle}
      >
        Contiguous
      </button>
      <button
        onClick={() => handleZoom(alaskaBounds)}
        className={mapButtonStyle}
      >
        AK
      </button>
      <button
        onClick={() => handleZoom(hawaiiBounds)}
        className={mapButtonStyle}
      >
        HI
      </button>
      <div className={`${mapButtonStyle} inline-flex items-center gap-2`}>
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={bboxSearch}
            onChange={(e) => handleBboxSearchChange(e.target.checked)}
            className="cursor-pointer"
          />
          <span>{bboxSearch? "Reset Area Search":"Search this Area"}</span>
        </label>
      </div>
    </div>
  );
}
