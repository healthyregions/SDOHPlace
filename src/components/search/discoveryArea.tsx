import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { Grid } from "@mui/material";
import ResultsPanel from "./resultsPanel";
import SearchArea from "./searchArea";
import DetailPanel from "./detailPanel";
import { useUrlParams } from "@/hooks/useUrlParams";
import { setShowDetailPanel } from "@/store/slices/uiSlice";
import { setSchema } from "@/store/slices/searchSlice";

export default function DiscoveryArea({ schema }): JSX.Element {
  const [highlightIds, setHighlightIds] = useState([]);
  const [highlightLyr, setHighlightLyr] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { results, relatedResults } = useSelector(
    (state: RootState) => state.search
  );
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  useEffect(() => {
    setTimeout(() => {
      dispatch(setSchema(schema));
    }, 0);
  }, [schema, dispatch]); // allow a bit of time to wait for url sync
  return (
    <Grid container>
      <Grid className="w-full px-[1em] sm:px-[2em] sm:mt-32 max-md:max-w-full shadow-none aspect-ratio bg-lightviolet">
        <Grid container className="container mx-auto pt-[2em] sm:pt-0">
          <SearchArea schema={schema} header="Data Discovery" />
        </Grid>
      </Grid>
      <Grid className="w-full px-[1em] sm:px-[2em]">
        <Grid container className="container mx-auto pt-[1.5rem]">
          <Grid item xs={12} sm={4}>
            <ResultsPanel
              schema={schema}
              setHighlightLyr={setHighlightLyr}
              setHighlightIds={setHighlightIds}
            />
          </Grid>
          <Grid item xs={12} sm={8} className="sm:ml-[0.5em]">
            {/* <MapPanel
            showMap={!showDetailPanel.length}
            resultsList={results}
            handleSearch={handleSearch}
          /> */}
            { showDetailPanel && showDetailPanel.length > 0 && (
              <DetailPanel resultList={results} relatedList={relatedResults} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
