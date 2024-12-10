import { Box } from "@mui/material";
import { FilterHeader } from "./filterHeader";
import { SortOptions } from "./sortOptions";
import { YearRangeSlider } from "./yearRangeSlider";
import { SearchUIConfig } from "@/components/searchUIConfig";
import { ThemeOptions } from "./themeOptions";

const FilterPanel = (): JSX.Element => {
  return (
    <div className="pr-5 filter-panel">
      <Box className="p-5 bg-lightbisque rounded">
        <FilterHeader />
        <SortOptions />
        <YearRangeSlider
          minRange={SearchUIConfig.search.index_year.min_year}
          maxRange={SearchUIConfig.search.index_year.max_year}
        />
        <ThemeOptions />
      </Box>
    </div>
  );
};

export default FilterPanel;
