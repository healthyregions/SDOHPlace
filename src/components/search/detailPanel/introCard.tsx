import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "../../../../meta/interface/SolrObject";

interface Props {
  resultItem: SolrObject;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  introCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
    paddingBottom: "0.5rem",
  },
}));

const IntroCard = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={`container mx-auto shadow-none aspect-ratio`}>
      <div className="flex flex-col sm:flex-row border-t border-t-1 border-strongorange">
        <div className="flex-1 w-full sm:w-2/3  sm:pl-3.5 sm:pr-6 sm:pt-5">
          <div className={`${classes.introCard}`}>
            <b>Keyword:</b>{" "}
            {props.resultItem.meta.keyword
              ? props.resultItem.meta.keyword.join(", ")
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Creator:</b>{" "}
            {props.resultItem.creator
              ? props.resultItem.creator.join(", ")
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Publisher:</b>{" "}
            {props.resultItem.meta.publisher
              ? props.resultItem.meta.publisher
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Preferred Citation:</b>{" "}
            {props.resultItem.meta.preferred_citation
              ? props.resultItem.meta.preferred_citation
              : ""}
          </div>
        </div>
        <div className="flex-1 w-full sm:w-1/3  sm:pl-6 sm:pr-2.25 sm:pt-5 bg-lightbisque">
          <div className={`${classes.introCard}`}>
            <b>Year:</b>{" "}
            {props.resultItem.index_year
              ? props.resultItem.index_year.join(", ")
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Spatial Resolution:</b>{" "}
            {props.resultItem.meta.spatial_resolution
              ? props.resultItem.meta.spatial_resolution.join(",")
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Resource:</b>{" "}
            {props.resultItem.resource_class
              ? props.resultItem.resource_class.join(", ")
              : ""}
          </div>
          <div className={`${classes.introCard}`}>
            <b>Access:</b>{" "}
            {props.resultItem.access_rights
              ? props.resultItem.access_rights
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroCard;
