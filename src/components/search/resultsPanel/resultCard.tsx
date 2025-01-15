"use client";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IconText from "../iconText";
import { SolrObject } from "meta/interface/SolrObject";
import IconMatch from "../helper/IconMatch";
import { setShowDetailPanel } from "@/store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Tooltip } from "@mui/material";
import { getScoreExplanation } from "../helper/FilterByScore";

interface Props {
  resultItem: SolrObject;
  setHighlightLyr: (value: string) => void;
  setHighlightIds: (value: string[]) => void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  resultCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
    paddingBottom: "0.5rem",
  },
  tooltipHeader: {
    marginBottom: "8px",
    fontWeight: 500,
    color: `${fullConfig.theme.colors["almostblack"]}`,
    borderBottom: `1px solid ${fullConfig.theme.colors["strongorange"]}`,
    paddingBottom: "4px",
  },
  tooltip: {
    backgroundColor: "white !important",
    color: `${fullConfig.theme.colors["almostblack"]}`,
    maxWidth: 500,
    fontSize: "0.875rem",
    border: `1px solid ${fullConfig.theme.colors["strongorange"]}`,
    borderRadius: "4px",
    padding: "8px",
    boxShadow: "0px 4px 4px 0px lightgray",
    "& .MuiTooltip-arrow": {
      color: fullConfig.theme.colors["strongorange"],
    },
  },
  scoreExplain: {
    marginBottom: "8px",
    fontSize: "0.8rem",
    color: fullConfig.theme.colors["frenchviolet"],
    fontStyle: "italic",
  },
  highlightsList: {
    listStyleType: "decimal",
    paddingLeft: "20px",
    margin: 0,
  },
  highlightItem: {
    marginBottom: "8px",
    color: `${fullConfig.theme.colors["almostblack"]}`,
    lineHeight: "1.4",
    "& strong": {
      color: fullConfig.theme.colors["strongorange"],
      fontWeight: 600,
    },
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));
const HighlightsTooltip = ({ q, highlights, score, avgScore, maxScore }) => {
  const classes = useStyles();
  const filteredHighlights = highlights.filter(
    (highlight) => highlight.trim() !== ""
  );
  return highlights.length > 0 ? (
    <div>
      <div className={classes.scoreExplain}>
        <span dangerouslySetInnerHTML={{ __html: getScoreExplanation(q, score, avgScore, maxScore) }} />
      </div>
      <ol className={classes.highlightsList}>
        {filteredHighlights.map((highlight, index) => (
          <li key={index} className={classes.highlightItem}>
            ...
            <span dangerouslySetInnerHTML={{ __html: highlight }} />
            ...
          </li>
        ))}
      </ol>
    </div>
  ) : (
    <div>
       <div className={classes.scoreExplain}>
        <span dangerouslySetInnerHTML={{ __html: getScoreExplanation(q, score, avgScore, maxScore) }} />
      </div>
    </div>
  );
};
const ResultCard = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  // show the most detailed geography that a record represents
  let lyrId: string;
  const spatial_res = props.resultItem.meta.spatial_resolution
    ? props.resultItem.meta.spatial_resolution
    : [];
  if (
    spatial_res.includes("Census Block Group") ||
    spatial_res.includes("Census Block")
  ) {
    lyrId = "bg";
  } else if (spatial_res.includes("Census Tract")) {
    lyrId = "tract";
  } else if (spatial_res.includes("County")) {
    lyrId = "county";
  } else if (spatial_res.includes("Zip Code Tabulation Area (ZCTA)")) {
    lyrId = "zcta";
  } else if (spatial_res.includes("State")) {
    lyrId = "state";
  }
  const allScores = useSelector((state: RootState) =>
    state.search.results.map((r) => r.score)
  );
  const maxScore = Math.max(...allScores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

  const cardContent = props.resultItem && (
    <div
      className={`container mx-auto p-5 bg-lightbisque shadow-none rounded aspect-ratio`}
      onClick={() => {
        dispatch(setShowDetailPanel(props.resultItem.id));
      }}
      style={{
        cursor: "pointer",
        border:
          showDetailPanel === props.resultItem.id
            ? `1px solid ${fullConfig.theme.colors["strongorange"]}`
            : `1px solid white`,
        background:
          showDetailPanel === props.resultItem.id
            ? `${fullConfig.theme.colors["lightbisque"]}`
            : undefined,
        boxShadow:
          showDetailPanel === props.resultItem.id
            ? "0px 4px 4px 0px lightgray"
            : undefined,
      }}
      onMouseOver={() => {
        props.setHighlightLyr(null);
        props.setHighlightLyr(lyrId);
        props.setHighlightIds(props.resultItem.meta.sdoh_highlight_ids_sm);
      }}
      onMouseOut={() => {
        props.setHighlightLyr(null);
      }}
    >
      <div className="flex flex-col sm:flex-row items-center mb-2">
        <div className="flex flex-col sm:flex-row items-center w-full">
          <div className="w-full sm:w-4/5 flex items-center">
            <IconText
              roundBackground={true}
              svgIcon={IconMatch(
                props.resultItem.meta.subject
                  ? props.resultItem.meta.subject.length > 1
                    ? "Composite"
                    : props.resultItem.meta.subject[0]
                  : ""
              )}
              label={props.resultItem.title}
              labelClass={`text-l font-medium ${fullConfig.theme.fontFamily["sans"]}`}
              labelColor={fullConfig.theme.colors["almostblack"]}
            />
          </div>
          <div className="sm:w-1/5 order-1 sm:order-none w-full sm:ml-auto flex items-center justify-center sm:justify-end font-bold">
            <button
              onClick={() => {
                dispatch(setShowDetailPanel(props.resultItem.id));
              }}
              style={{ color: fullConfig.theme.colors["frenchviolet"] }}
            >
              View <span className="ml-1">&#8594;</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:mt-4">
        <div className="flex-1 w-full sm:w-1/2">
          <div className={`${classes.resultCard} truncate `}>
            Keyword:{" "}
            {props.resultItem.meta.keyword
              ? props.resultItem.meta.keyword.join(", ")
              : ""}
          </div>
          <div className={`${classes.resultCard} truncate `}>
            Creator:{" "}
            {props.resultItem.creator
              ? props.resultItem.creator.join(", ")
              : ""}
          </div>
          <div className={`${classes.resultCard} truncate `}>
            Publisher:{" "}
            {props.resultItem.meta.publisher
              ? props.resultItem.meta.publisher[0]
              : ""}
          </div>
        </div>
        <div className="flex-1 w-full sm:w-1/2 sm:pl-8">
          <div className={`${classes.resultCard} truncate `}>
            Year:{" "}
            {props.resultItem.index_year
              ? props.resultItem.index_year.join(", ")
              : ""}
          </div>
          <div className={`${classes.resultCard} truncate `}>
            Spatial Res:{" "}
            {props.resultItem.meta.spatial_resolution
              ? props.resultItem.meta.spatial_resolution.join(", ")
              : ""}
          </div>
          <div className={`${classes.resultCard} truncate`}>
            Resource:{" "}
            {props.resultItem.resource_class
              ? props.resultItem.resource_class.join(", ")
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
  return props.resultItem ? (
    (props.resultItem.highlights && props.resultItem.highlights.length > 0) ||
    props.resultItem.q ? (
      <Tooltip
        title={
          <HighlightsTooltip
            q={props.resultItem.q}
            highlights={props.resultItem.highlights || []}
            score={props.resultItem.score}
            avgScore={avgScore}
            maxScore={maxScore}
          />
        }
        classes={{ tooltip: classes.tooltip }}
        placement="right"
        arrow
      >
        {cardContent}
      </Tooltip>
    ) : (
      cardContent
    )
  ) : (
    <></>
  );
};

export default ResultCard;
