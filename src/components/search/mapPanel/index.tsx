import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import MapPanelContent from "./mapPanelContent";
import { SolrObject } from "meta/interface/SolrObject";

interface Props {
  resultsList: SolrObject[];
  highlightLyr?: string;
  highlightIds?: string[];
  showMap: string;
  schema: any;
}

export default function MapPanel(props: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Grid item className="sm:px-[2em]" xs={12} display={props.showMap}>
        <div className="h-full w-full bg-gray-100 animate-pulse" />
      </Grid>
    );
  }

  return <MapPanelContent {...props} />;
}
