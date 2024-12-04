// import { useUrlParams } from "@/hooks/useUrlParams";
// import { AppDispatch, RootState } from "@/store";
// import { setFilterQueries } from "@/store/slices/searchSlice";
// import { Box, Slider } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const YearRangeSlider = ({ minRange, maxRange }: { 
//   minRange: number; 
//   maxRange: number; 
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { query, filterQueries } = useSelector((state: RootState) => state.search);
//   const { setters, values } = useUrlParams();
//   const [yearRange, setYearRange] = useState([minRange, maxRange]);
//   const [marks, setMarks] = useState([]);

//   useEffect(() => {
//     if (values.indexYear) {
//       const years = values.indexYear.split(',').map(Number);
//       const range = [Math.min(...years), Math.max(...years)];
//       setYearRange(range);
//       setMarks([
//         { value: range[0], label: `${range[0]}` },
//         { value: range[1], label: `${range[1]}` }
//       ]);
//     } else {
//       setYearRange([minRange, maxRange]);
//       setMarks([
//         { value: minRange, label: `${minRange}` },
//         { value: maxRange, label: `${maxRange}` }
//       ]);
//     }
//   }, [values.indexYear, minRange, maxRange]);

//   const handleYearRangeChange = (event, newValue) => {
//     setYearRange(newValue);
    
//     const newFilterQueries = filterQueries.filter(
//       f => f.attribute !== "index_year"
//     );

//     if (newValue[0] !== minRange || newValue[1] !== maxRange) {
//       const yearsArray = Array.from(
//         { length: newValue[1] - newValue[0] + 1 },
//         (_, i) => newValue[0] + i
//       );
      
//       newFilterQueries.push({
//         attribute: "index_year",
//         value: yearsArray.join(",")
//       });
      
//       setters.setUrlIndexYear(yearsArray.join(","));
//     } else {
//       setters.setUrlIndexYear(null);
//     }

//     dispatch(setFilterQueries(newFilterQueries));
//   };

//   return (
//     <Box className="mt-6">
//       <Box className="text-s font-bold">Year</Box>
//       <Slider
//         className="text-frenchviolet w-[calc(100%-22px)] ml-[11px]"
//         min={minRange}
//         max={maxRange}
//         value={yearRange}
//         onChange={handleYearRangeChange}
//         valueLabelDisplay="off"
//         marks={marks}
//       />
//     </Box>
//   );
// };