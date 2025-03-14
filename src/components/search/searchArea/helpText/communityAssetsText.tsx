import { overlayRegistry } from "@/components/map/helper/layers";
import { Typography, List, ListItem } from "@mui/material";
import Link from "next/link";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export const CommunityAssetsText = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  return (
    <>
      {" "}
      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        We provide a number of map overlay layers that can be used for
        contextual reference about community assets during your data search.
        This is a feature we hope to expand in the future, so please{" "}
        <Link href="/contact">get in touch</Link> if you have ideas for more
        layers you would like to see or contribute.
      </Typography>
      <Typography sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}>
        <strong>Community asset layers:</strong>
      </Typography>
      <List
        sx={{
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        {Object.keys(overlayRegistry).map((key, index) => (
          <ListItem key={index}>
            <span>
              <strong>{key}:</strong> {overlayRegistry[key].description}
              {/* [<Link href={overlayRegistry[key].url} target="_blank">learn more</Link>] */}
            </span>
          </ListItem>
        ))}
      </List>
      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        Currently, all layers are filtered from the{" "}
        <Link
          href="https://docs.overturemaps.org/guides/places/"
          target="_blank"
        >
          Places
        </Link>{" "}
        dataset published by the{" "}
        <Link href="https://overturemaps.org" target="_blank">
          Overture Maps Foundation
        </Link>
        . Visit{" "}
        <Link
          href="https://github.com/healthyregions/overture-poi-extract"
          target="_blank"
        >
          healthyregions/overture-poi-extract
        </Link>{" "}
        for details about the filtering process we use, and to download the raw
        data.
      </Typography>
    </>
  );
};
