import { AppDispatch, RootState } from "@/store";
import { setIndexYear } from "@/store/slices/searchSlice";
import { Box, debounce, Slider } from "@mui/material";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const YearRangeSlider = ({
  minRange,
  maxRange,
}: {
  minRange: number;
  maxRange: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const indexYear = useSelector((state: RootState) => state.search.indexYear);
  const [yearRange, setYearRange] = useState([minRange, maxRange]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const yearParam = searchParams.get("index_year");
    if (yearParam) {
      const [start, end] = yearParam.split("-").map(Number);
      setYearRange([start, end]);
    } else if (indexYear && indexYear.length > 0) {
      setYearRange([
        Math.min(...indexYear.map(Number)),
        Math.max(...indexYear.map(Number)),
      ]);
    } else {
      setYearRange([minRange, maxRange]);
    }
  }, [indexYear, minRange, maxRange]);

  const marks = useMemo(
    () => [
      { value: yearRange[0], label: `${yearRange[0]}` },
      { value: yearRange[1], label: `${yearRange[1]}` },
    ],
    [yearRange]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleYearRangeChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (!Array.isArray(newValue)) return;
      setYearRange(newValue);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const [start, end] = newValue;
        const yearsArray = Array.from(
          { length: end - start + 1 },
          (_, i) => start + i
        );
        dispatch(setIndexYear(yearsArray));
      }, 300);
    },
    [dispatch]
  );

  return (
    <Box className="mt-6">
      <Box className="text-s font-bold">Year</Box>
      <Box display="flex" alignItems="center" className="mx-3">
        <Slider
          className="text-frenchviolet"
          min={minRange}
          max={maxRange}
          value={yearRange}
          onChange={handleYearRangeChange}
          valueLabelDisplay="auto"
          marks={marks}
          step={1}
        />
      </Box>
    </Box>
  );
};
