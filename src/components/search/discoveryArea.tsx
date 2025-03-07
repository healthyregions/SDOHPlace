"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { Collapse, Grid } from "@mui/material";
import SearchArea from "./searchArea";
import DetailPanel from "./detailPanel";
import { initializeSearch, setSchema } from "@/store/slices/searchSlice";
import MapPanel from "./mapPanel/mapPanelContent";
import dynamic from "next/dynamic";
import * as React from "react";
import styled from "@emotion/styled";

const BannerLink = styled.a`
  margin-left: 0.25rem;
  :link { text-decoration: none; }
  :visited { text-decoration: none; }
  :hover { text-decoration: underline; }
  :active { text-decoration: underline; }
`;

const Banner = styled.div`
  font-size: 14px;
`;

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
  const dispatch = useDispatch<AppDispatch>();
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  const { results, relatedResults } = useSelector(
    (state: RootState) => state.search
  );
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isMounted && typeof window !== "undefined")
      dispatch(initializeSearch({ schema }));
  }, [schema, dispatch, isMounted]);

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

      <Grid className="w-full px-[1em] sm:px-[2em] max-md:max-w-full shadow-none aspect-ratio bg-lightbisque">
        <Grid container className="container mx-auto py-[1em] px-4">
          <Banner>
            This platform is under development, feel free to
            <BannerLink href={'https://go.illinois.edu/DATA-DISCOVERY-FEEDBACK'} target={'_blank'}>share your feedback &rarr;</BannerLink>
          </Banner>
        </Grid>
      </Grid>

      <Grid
        className="w-full px-[1em] sm:px-[2em] transition-all duration-300"
      >
        <Grid container className="container mx-auto pt-[1.5rem]">
          <Grid item xs={12} sm={6}>
            <DynamicResultsPanel schema={schema} />
          </Grid>
          <Grid item xs={12} sm={6} className="sm:ml-[0.5em]">
            <MapPanel
              resultsList={results}
              showMap={
                showDetailPanel && (results && results.find((r) => r.id === showDetailPanel))
                  ? "none"
                  : "block"
              }
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
