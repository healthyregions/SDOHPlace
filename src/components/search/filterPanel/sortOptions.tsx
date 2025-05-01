import { AppDispatch, RootState } from "@/store";
import { setSortAndFetch } from "@/store/slices/searchSlice";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export const SortOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sort, isSearching, initializing } = useSelector(
    (state: RootState) => state.search
  );

  const handleSort = (field: string, direction: string) => {
    if (isSearching || initializing) return;
    dispatch(setSortAndFetch({ field, direction }));
  };

  return (
    <Box display="flex" alignItems="center">
      <Box>
        <span
          className={`pr-5 cursor-pointer text-frenchviolet font-bold ${
            isSearching ? "opacity-50" : ""
          }`}
          style={{
            textDecoration: sort.sortBy === "score" ? "underline" : "none",
          }}
          onClick={() => handleSort("score", "desc")}
        >
          Relevance
        </span>

        <span
          className={`pr-5 cursor-pointer text-frenchviolet font-bold ${
            isSearching ? "opacity-50" : ""
          }`}
          style={{
            textDecoration:
              sort.sortBy !== "score" && sort.sortOrder === "desc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("index_year", "desc")}
        >
          Recent first
        </span>

        <span
          className={`cursor-pointer text-frenchviolet font-bold ${
            isSearching ? "opacity-50" : ""
          }`}
          style={{
            textDecoration:
              sort.sortBy !== "score" && sort.sortOrder !== "desc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("index_year", "asc")}
        >
          Oldest first
        </span>
      </Box>
    </Box>
  );
};
