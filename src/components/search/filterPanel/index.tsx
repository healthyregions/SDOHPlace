import { Box } from "@mui/material";
import ThemeIcons from "../helper/themeIcons";
import { FilterHeader } from "./filterHeader";
import { SortOptions } from "./sortOptions";

const FilterPanel = ({ schema }): JSX.Element => {
  // const minRange = useMemo(() =>
  //   generateFilterFromCurrentResults["index_year"]
  //     ? Math.min(...generateFilterFromCurrentResults["index_year"].map(Number))
  //     : 1963
  // , [generateFilterFromCurrentResults]);

  // const maxRange = useMemo(() =>
  //   generateFilterFromCurrentResults["index_year"]
  //     ? Math.max(...generateFilterFromCurrentResults["index_year"].map(Number))
  //     : 2024
  // , [generateFilterFromCurrentResults]);

  return (
    <div className="pr-5 filter-panel">
      <Box className="p-5 bg-lightbisque rounded">
        <FilterHeader />
        <SortOptions />
        {/* <YearRangeSlider minRange={minRange} maxRange={maxRange} /> */}
        <Box className="mt-1">
          <Box className="text-s font-bold" sx={{ mb: 1 }}>
            Theme
          </Box>
          <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
            <ThemeIcons />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default FilterPanel;
