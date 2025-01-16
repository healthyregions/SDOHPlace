"use client";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
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
import { getAllScoresSelector } from "../../../store/selectors/SearchSelector";
import { setMapPreview } from "@/store/slices/searchSlice";

interface Props {
  resultItem: SolrObject;
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
const HighlightsTooltip = ({ q, spellcheck, highlights, score, avgScore, maxScore }) => {
  const classes = useStyles();
  const filteredHighlights = highlights.filter(
    (highlight) => highlight.trim() !== ""
  );
  const currentQuery = useSelector((state: RootState) => state.search.query);
  return highlights.length > 0 ? (
    <div>
      <div className={classes.scoreExplain} style={{ paddingBottom: 8, borderBottom: `1px solid ${fullConfig.theme.colors["strongorange"]}` }}>
        <span dangerouslySetInnerHTML={{ __html: getScoreExplanation(q, spellcheck, currentQuery, score, avgScore, maxScore) }} />
        <p style={{paddingTop: 4}}>Information in this result includes:</p>
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
        <span dangerouslySetInnerHTML={{ __html: getScoreExplanation(q, spellcheck, currentQuery , score, avgScore, maxScore) }} />
      </div>
    </div>
  );
};
const ResultCard = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  const mapPreview = useSelector((state: RootState) => state.search.mapPreview);
  const { maxScore, avgScore } = useSelector(getAllScoresSelector);

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
        <FormControlLabel
          label="Show coverage area"
          onClick={(event) => {
            event.stopPropagation();
          }}
          control={
            <Checkbox
              id={`sc-checkbox-${props.resultItem.id}`}
              value={props.resultItem.meta}
              onChange={(event) => {

                if (event.target.checked) {
                  dispatch(
                    setMapPreview([
                      ...mapPreview,
                      {
                        lyrId: props.resultItem.id,
                        filterIds: props.resultItem.meta.highlight_ids,
                      },
                    ])
                  );
                } else {
                  dispatch(
                    setMapPreview(
                      mapPreview.filter(
                        (item) => item.lyrId != props.resultItem.id
                      )
                    )
                  );
                }
              }}
              icon={
                <span
                  style={{
                    borderRadius: "4px",
                    border: `2px solid ${fullConfig.theme.colors["frenchviolet"]}`,
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                ></span>
              }
              checkedIcon={
                <span
                  style={{
                    borderRadius: "4px",
                    border: `2px solid ${fullConfig.theme.colors["frenchviolet"]}`,
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${fullConfig.theme.colors["frenchviolet"]}`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              }
            />
          }
        />
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
    props.resultItem.q && !props.resultItem.q.includes('*') ? (
      <Tooltip
        title={
          <HighlightsTooltip
            q={props.resultItem.q}
            spellcheck = {props.resultItem.spellcheck}
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
