"use client";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
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
import { getAllScoresSelector } from "@/store/selectors/SearchSelector";
import { EventType } from "@/lib/event";
import { usePlausible } from "next-plausible";

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
    backgroundColor: "rgba(255, 255, 255, 0.9) !important",
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
  mapPreviewControl: {
    padding: "6px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    width: "fit-content",
    marginLeft: "auto",
  },
}));
const HighlightsTooltip = ({
  q,
  spellcheck,
  highlights,
  score,
  avgScore,
  maxScore,
}) => {
  const classes = useStyles();
  const filteredHighlights = highlights.filter(
    (highlight) => highlight.trim() !== ""
  );
  const currentQuery = useSelector((state: RootState) => state.search.query);
  return highlights.length > 0 ? (
    <div>
      <div
        className={classes.scoreExplain}
        style={{
          paddingBottom: 8,
          borderBottom: `1px solid ${fullConfig.theme.colors["strongorange"]}`,
        }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: getScoreExplanation(
              q,
              spellcheck,
              currentQuery,
              score,
              avgScore,
              maxScore
            ),
          }}
        />
        <p style={{ paddingTop: 4 }}>Information in this result includes:</p>
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
        <span
          dangerouslySetInnerHTML={{
            __html: getScoreExplanation(
              q,
              spellcheck,
              currentQuery,
              score,
              avgScore,
              maxScore
            ),
          }}
        />
      </div>
    </div>
  );
};
const ResultCard = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const plausible = usePlausible();
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  const showTooltips = useSelector((state: RootState) => state.ui.showTooltips);
  const mapPreview = useSelector((state: RootState) => state.ui.mapPreview);
  const { maxScore, avgScore } = useSelector(getAllScoresSelector);

  const isInMapPreview = React.useMemo(() => {
    return mapPreview.some((p) => p.lyrId === props.resultItem.id);
  }, [mapPreview, props.resultItem.id]);

  const handleMapPreviewToggle = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!props.resultItem.meta.highlight_ids?.length) return;
      if (isInMapPreview) {
        dispatch(
          setMapPreview(
            mapPreview.filter((item) => item.lyrId != props.resultItem.id)
          )
        );
      } else {
        dispatch(
          setMapPreview([
            {
              lyrId: props.resultItem.id,
              filterIds: props.resultItem.meta.highlight_ids,
            },
          ])
        );

        plausible(EventType.ClickedMapPreview, {
          props: {
            resourceId: props.resultItem.id,
          },
        });
      }
    },
    [dispatch, isInMapPreview, mapPreview, plausible, props.resultItem]
  );

  const handleShowDetails = React.useCallback(
    (event) => {
      dispatch(setShowDetailPanel(props.resultItem.id));
      plausible(EventType.ClickedItemDetails, {
        props: {
          resourceId: props.resultItem.id,
        },
      });
    },
    [dispatch, plausible, props.resultItem.id]
  );

  const cardContent = props.resultItem && (
    <div
      className={`container mx-auto p-3 bg-lightbisque shadow-none rounded aspect-ratio`}
      onClick={handleShowDetails}
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
        <Grid
          container
          spacing={0}
          className="flex flex-col sm:flex-row items-center"
        >
          <Grid item sm={10} className="items-start">
            <IconText
              roundBackground={true}
              svgIcon={IconMatch(
                props.resultItem.meta.subject?.length > 0
                  ? props.resultItem.meta.subject[0]
                  : ""
              )}
              label={props.resultItem.title}
              labelClass={`text-l font-medium ${fullConfig.theme.fontFamily["sans"]}`}
              labelColor={fullConfig.theme.colors["almostblack"]}
            />
            <div
              className={`${classes.resultCard} truncate ml-12`}
              style={{ marginTop: "-0.5rem" }}
            >
              by{" "}
              {props.resultItem.meta.publisher
                ? props.resultItem.meta.publisher[0]
                : ""}
            </div>
          </Grid>
          <Grid
            item
            sm={2}
            className="order-1 sm:order-none sm:ml-auto items-center justify-center sm:justify-end font-bold"
          >
            <div className={"flex justify-end"}>
              <button
                onClick={handleShowDetails}
                style={{ color: fullConfig.theme.colors["frenchviolet"] }}
              >
                Details <span className="ml-1">&#8594;</span>
              </button>
            </div>

            <div className={"flex justify-end"}>
              <div
                className={classes.mapPreviewControl}
                onClick={handleMapPreviewToggle}
                style={{
                  cursor: props.resultItem.meta.highlight_ids?.length
                    ? "pointer"
                    : "default",
                  opacity: props.resultItem.meta.highlight_ids?.length
                    ? 1
                    : 0.5,
                }}
                title={
                  !props.resultItem.meta.highlight_ids?.length
                    ? "No geographic areas have been defined for this dataset"
                    : "Preview the geographic areas that this dataset covers"
                }
              >
                <div
                  style={{
                    color: `${
                      props.resultItem.meta.highlight_ids?.length
                        ? fullConfig.theme.colors["frenchviolet"]
                        : fullConfig.theme.colors["darkgray"]
                    }`,
                    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
                    fontSize: "0.875rem",
                  }}
                >
                  {isInMapPreview ? "Remove preview" : "Show on map"}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <Grid
        spacing={2}
        container
        className="flex flex-col sm:flex-row px-2 mt-1"
      >
        <Grid item xs={8} sx={{ mt: "1em", pt: "0 !important" }}>
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
        <Grid item xs={4} sx={{ mt: "1em", pt: "0 !important" }}>
          <div className={`${classes.resultCard} truncate `}>
            Year:{" "}
            {props.resultItem.index_year?.length > 1
              ? `${Math.min(
                  ...props.resultItem.index_year.map((y) => Number(y))
                )} - ${Math.max(
                  ...props.resultItem.index_year.map((y) => Number(y))
                )}`
              : props.resultItem.index_year}
          </div>
          <div className={`${classes.resultCard} truncate `}>
            Spatial Res:{" "}
            {props.resultItem.meta.spatial_resolution
              ? props.resultItem.meta.spatial_resolution.join(", ")
              : ""}
          </div>
        </Grid>
      </Grid>
    </div>
  );
  return props.resultItem ? (
    showTooltips &&
    ((props.resultItem.highlights && props.resultItem.highlights.length > 0) ||
      (props.resultItem.q && !props.resultItem.q.includes("*"))) ? (
      <Tooltip
        title={
          <HighlightsTooltip
            q={props.resultItem.q}
            spellcheck={props.resultItem.spellcheck}
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
