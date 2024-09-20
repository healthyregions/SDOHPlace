import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "../../../../meta/interface/SolrObject";
import IntroCard from "./introCard";
import IconTag from "./iconTag";
import ParagraphCard from "./paragraphCard/paragraphCard";
import HeaderRow from "./headerRow/headerRow";
import IconMatch from "../helper/IconMatch";

interface Props {
  resultItem: SolrObject;
  setShowDetailPanel: (value: string) => void;
  showSharedLink: string;
  setShowSharedLink: (value: string) => void;
  handleSearch(params: any, value: string, filterQueries: any): void;
  handleInputReset: () => void;
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
    props.resultItem && (
      <div
        className={`container sm:px-11 sm:mb-60 mx-auto bg-white shadow-none aspect-ratio`}
      >
        <div className="flex flex-col sm:flex-row mb-8" id="introCardRow">
          <HeaderRow
            resultItem={props.resultItem}
            headerIcon={IconMatch(
              props.resultItem.meta.subject
                ? props.resultItem.meta.subject.length > 1
                  ? "Composite"
                  : props.resultItem.meta.subject[0]
                : ""
            )}
            showDetailPanel={props.setShowDetailPanel}
            showSharedLink={props.showSharedLink}
            setShowSharedLink={props.setShowSharedLink}
          />
        </div>
        <div className="flex flex-col sm:flex-row mb-12" id="introCardRow">
          <IntroCard resultItem={props.resultItem} />
        </div>

        {props.resultItem.meta.subject && (
          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 sm:gap-8"
            id="iconTagRow"
          >
            {props.resultItem.meta.subject.map((s, index) => (
              <IconTag
                svgIcon={IconMatch(s)}
                key={index}
                label={s}
                labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                labelColor={fullConfig.theme.colors["almostblack"]}
                roundBackground={true}
                handleSearch={props.handleSearch}
                handleInputReset={props.handleInputReset}
              />
            ))}
          </div>
        )}

        <div
          className="container pb-2 gap-4 sm:gap-8 border-b border-b-1 border-strongorange rounded"
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
    )
  );
};

export default DetailPanel;
