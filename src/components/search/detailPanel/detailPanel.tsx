import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import dataDiscoveryIcon from "@/public/logos/data-discovery-icon.svg";
import { SolrObject } from "../../../../meta/interface/SolrObject";
import IntroCard from "./introCard";
import IconTag from "./iconTag";
import ParagraphCard from "./paragraphCard/paragraphCard";

interface Props {
  resultItem: SolrObject;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  detailPanel: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
  },
}));

const DetailPanel = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div
      className={`container sm:px-11 sm:mb-60 mx-auto bg-white shadow-none overflow-hidden aspect-ratio`}
    >
      <div className="flex flex-col sm:flex-row mb-14" id="introCardRow">
        <IntroCard resultItem={props.resultItem} />
      </div>
      <div
        className="flex flex-col sm:flex-row mb-14 gap-4 sm:gap-8"
        id="iconTagRow"
      >
        <IconTag
          svgIcon={dataDiscoveryIcon}
          label="Transportation"
          labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
          labelColor={fullConfig.theme.colors["almostblack"]}
          roundBackground={true}
        />
        <IconTag
          svgIcon={dataDiscoveryIcon}
          label="Food access"
          labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
          labelColor={fullConfig.theme.colors["almostblack"]}
          roundBackground={true}
        />
        <IconTag
          svgIcon={dataDiscoveryIcon}
          label="Greenspaces"
          labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
          labelColor={fullConfig.theme.colors["almostblack"]}
          roundBackground={true}
        />
      </div>
      <div
        className="container pb-8 gap-4 sm:gap-8 border-b border-b-1 border-strongorange rounded"
        id="notesRow"
      >
        {props.resultItem.meta.display_note &&
          props.resultItem.meta.display_note.map((s, index) => {
            const [before, after] = (
              s.includes(":") ? s.split(/:(.*)/, 2) : ["", s]
            ) as [string, string];
            return (
              <ParagraphCard
                key={index}
                title={before}
                value={after}
                type="display_note"
              />
            );
          })}
        {props.resultItem.meta.data_usage_notes && (
          <ParagraphCard
            type="usage_tip"
            title="Usage Tip"
            value={props.resultItem.meta.data_usage_notes}
          />
        )}
      </div>
      <div className="container mt-7 gap-4 sm:gap-8" id="restRow">
        {props.resultItem.meta.methods_variables && (
          <ParagraphCard
            type="rest"
            title="Methods"
            value={props.resultItem.meta.methods_variables.join(", ")}
          />
        )}
        {props.resultItem.meta.data_variables && (
          <ParagraphCard
            type="rest"
            title="Data variables"
            value={props.resultItem.meta.data_variables.join(", ")}
          />
        )}
        {props.resultItem.meta.references && (
          <ParagraphCard
            type="references"
            title="Link"
            value={props.resultItem.meta.references}
          />
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
