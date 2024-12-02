import { AppDispatch, RootState } from "@/store";
import {
  fetchSearchResults,
  setSortBy,
  setSortOrder,
} from "@/store/slices/searchSlice";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export const SortOptions = ({ schema }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    sortBy,
    sortOrder,
    query,
    filterQueries, // need these for search
  } = useSelector((state: RootState) => state.search);

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    console.log("SortOptions schema:", schema);
    // remove sort from url to save length
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
    // sort from server side to handle large datasets
    dispatch(
      fetchSearchResults({
        query: query || "*",
        filterQueries,
        schema,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      })
    );
  };

  return (
    <Box display="flex" alignItems="center">
      <Box>
        <span
          className="pr-5 cursor-pointer text-frenchviolet font-bold"
          style={{
            textDecoration: !sortBy && !sortOrder ? "underline" : "none",
          }}
          onClick={() => handleSort("score", "desc")}
        >
          Relevance
        </span>

        <span
          className="pr-5 cursor-pointer text-frenchviolet font-bold"
          style={{
            textDecoration:
              sortBy === "modified" && sortOrder === "desc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("modified", "desc")}
        >
          Recent first
        </span>

        <span
          className="cursor-pointer text-frenchviolet font-bold"
          style={{
            textDecoration:
              sortBy === "modified" && sortOrder === "asc"
                ? "underline"
                : "none",
          }}
          onClick={() => handleSort("modified", "asc")}
        >
          Oldest first
        </span>
      </Box>
    </Box>
  );
};
