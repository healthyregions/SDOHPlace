import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  setFilterQueries,
  setQuery,
  setSpatialResolution,
} from "@/store/slices/searchSlice";
import { useUrlParams } from "@/hooks/useUrlParams";

export const useFilterQueries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { values } = useUrlParams();
  const { filterQueries, spatialResolution } = useSelector(
    (state: RootState) => state.search
  );
  useEffect(() => {
    if (values.urlSpatialResolution?.length > 0) {
      dispatch(setSpatialResolution(values.urlSpatialResolution));
    }
  }, [values.urlSpatialResolution, dispatch]);


  useEffect(() => {
    const newFilterQueries = [];
    
    if (spatialResolution?.length > 0) {
      spatialResolution.forEach((resolution) => {
        newFilterQueries.push({
          attribute: "spatial_resolution",
          value: resolution,
        });
      });
    }
    if (values.urlQuery) {
      newFilterQueries.push({
        attribute: "query",
        value: values.urlQuery,
      });
    }
    // Only update if filters have actually changed
    const currentFiltersString = JSON.stringify(filterQueries);
    const newFiltersString = JSON.stringify(newFilterQueries);
    if (currentFiltersString !== newFiltersString) {
      dispatch(setFilterQueries(newFilterQueries));
    }
  }, [values.urlQuery, spatialResolution, filterQueries, dispatch]);
  return {
    getCurrentFilterQueries: () => filterQueries,
  };
};