import { createSelector } from "reselect";
import { RootState } from "@/store";

const getSearchResults = (state: RootState) => state.search.results;

export const getAllScoresSelector = createSelector(
  [getSearchResults],
  (results) => {
    const scores = results.map((r) => r.score);
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      scores,
      maxScore,
      avgScore,
    };
  }
);
