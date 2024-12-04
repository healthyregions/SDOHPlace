import { AppDispatch, RootState } from "@/store";
import {
  setSortBy,
  setSortOrder,
} from "@/store/slices/searchSlice";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export const SortOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    sortBy,
    sortOrder,
    isSearching 
  } = useSelector((state: RootState) => state.search);

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
  };

  return (
    <Box display="flex" alignItems="center">
      <Box>
        <span
          className={`pr-5 cursor-pointer text-frenchviolet font-bold ${
            isSearching ? 'opacity-50' : ''
          }`}
          style={{
            textDecoration: !sortBy && !sortOrder ? "underline" : "none",
          }}
          onClick={() => handleSort("score", "desc")}
        >
          Relevance
        </span>

        <span
          className={`pr-5 cursor-pointer text-frenchviolet font-bold ${
            isSearching ? 'opacity-50' : ''
          }`}
          style={{
            textDecoration:
              sortBy === "issued" && sortOrder === "desc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("date_issued", "desc")}
        >
          Recent first
        </span>

        <span
          className={`cursor-pointer text-frenchviolet font-bold ${
            isSearching ? 'opacity-50' : ''
          }`}
          style={{
            textDecoration:
              sortBy === "issued" && sortOrder === "asc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("date_issued", "asc")}
        >
          Oldest first
        </span>
      </Box>
    </Box>
  );
};
