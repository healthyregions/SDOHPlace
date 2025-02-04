"use client";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import {Checkbox, FormControlLabel, Grid, Typography} from "@mui/material";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IconText from "../iconText";
import { SolrObject } from "meta/interface/SolrObject";
import IconMatch from "../helper/IconMatch";
import { setShowDetailPanel, setMapPreview } from "@/store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Tooltip } from "@mui/material";
import { getScoreExplanation } from "../helper/FilterByScore";
import { getAllScoresSelector } from "../../../store/selectors/SearchSelector";

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
  const mapPreview = useSelector((state: RootState) => state.ui.mapPreview);
  const { maxScore, avgScore } = useSelector(getAllScoresSelector);

  const cardContent = props.resultItem && (
    <div
      className={`container mx-auto p-3 bg-lightbisque shadow-none rounded aspect-ratio`}
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
      <div className="flex flex-col sm:flex-row items-center px-2">
        <div className="flex flex-col sm:flex-row items-center w-full">
          <div className="w-full sm:w-4/5 flex items-start flex-col">
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
            <div className={`${classes.resultCard} truncate ml-12`} style={{ marginTop: '-0.5rem'}}>
              by{" "}
              {props.resultItem.meta.publisher
                ? props.resultItem.meta.publisher[0]
                : ""}
            </div>
          </div>
          <div className="sm:w-1/5 order-1 sm:order-none w-full sm:ml-auto flex items-center justify-center sm:justify-end font-bold">
            <div className={'flex flex-col'}>
              <button
                onClick={() => {
                  dispatch(setShowDetailPanel(props.resultItem.id));
                }}
                style={{ color: fullConfig.theme.colors["frenchviolet"] }}
              >
                Details <span className="ml-1">&#8594;</span>
              </button>

              {/* Checkbox : Show coverage area on map */}
              <FormControlLabel
                disabled={!props.resultItem.meta.highlight_ids?.length}
                title={!props.resultItem.meta.highlight_ids?.length ? 'No geographic areas have been defined for this dataset' : 'Preview the geographic areas that this dataset covers'}
                label={<div style={{
                  color: `${props.resultItem.meta.highlight_ids?.length ? fullConfig.theme.colors["frenchviolet"] : fullConfig.theme.colors["darkgray"]}`,
                  padding: 0,
                  fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                  fontSize: "0.875rem" }}>
                  {mapPreview.find(p => p.lyrId === props.resultItem.id) ? 'Hide' : 'Show'} on map
              </div>}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                control={
                  <Checkbox
                    id={`sc-checkbox-${props.resultItem.id}`}
                    value={props.resultItem.meta}
                    style={{display: 'none'}}
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
                          border: `2px solid ${props.resultItem.meta.highlight_ids?.length ? fullConfig.theme.colors["frenchviolet"] : fullConfig.theme.colors["darkgray"]}`,
                          width: "14px",
                          height: "14px",
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
                          width: "14px",
                          height: "14px",
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
          </div>

        </div>
      </div>
      <Grid spacing={0} container className="flex flex-col sm:flex-row px-2 mt-1">
        <Grid item spacing={0} xs={7} className="flex-1">
          <div className={`${classes.resultCard} truncate `}>
            Keywords:{" "}
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
        </Grid>
        <Grid spacing={0} xs={5} className="flex-1 w-1/3 sm:pl-8">
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
          {/*<div className={`${classes.resultCard} truncate`}>
            Resource:{" "}
            {props.resultItem.resource_class
              ? props.resultItem.resource_class.join(", ")
              : ""}
          </div>*/}
        </Grid>
      </Grid>
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
