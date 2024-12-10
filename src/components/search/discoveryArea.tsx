"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { Grid } from "@mui/material";
import SearchArea from "./searchArea";
import DetailPanel from "./detailPanel";
import { setSchema } from "@/store/slices/searchSlice";
import MapPanel from "./mapPanel/mapPanelContent";
import dynamic from "next/dynamic";

const DynamicResultsPanel = dynamic(() => import("./resultsPanel"), {
  ssr: false,
  loading: () => (
    <Grid container className="h-full">
      <Grid item xs={12}>
        <div className="h-full w-full bg-gray-100 animate-pulse" />
      </Grid>
    </Grid>
  ),
});

export default function DiscoveryArea({ schema }): JSX.Element {
  const [highlightIds, setHighlightIds] = useState([]);
  const [highlightLyr, setHighlightLyr] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { results, relatedResults } = useSelector(
    (state: RootState) => state.search
  );
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      dispatch(setSchema(schema));
    }
  }, [schema, dispatch, isMounted]);
  if (!isMounted) {
    return (
      <Grid container>
        <Grid className="w-full px-[1em] sm:px-[2em] sm:mt-32 max-md:max-w-full shadow-none aspect-ratio bg-lightviolet">
          <div className="h-full w-full bg-gray-100 animate-pulse" />
        </Grid>
      </Grid>
    );
  }
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
            <DynamicResultsPanel
              schema={schema}
              setHighlightLyr={setHighlightLyr}
              setHighlightIds={setHighlightIds}
            />
          </Grid>
          <Grid item xs={12} sm={8} className="sm:ml-[0.5em]">
            <MapPanel
              resultsList={results}
              showMap={showDetailPanel ? "none" : "block"}
              schema={schema}
            />
            {showDetailPanel && showDetailPanel.length > 0 && (
              <DetailPanel resultList={results} relatedList={relatedResults} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
