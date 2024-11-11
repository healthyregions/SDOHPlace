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
import { GetAllParams } from "../helper/ParameterList";
import { url } from "inspector";

interface Props {
  //resultItem: SolrObject;
  fetchResults: SolrObject[];
  relatedResults: SolrObject[];
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
  const urlParams = GetAllParams();
  let resultItem = props.fetchResults.find(
    (r) => r.id === urlParams.showDetailPanel
  );
  if (!resultItem) {
    resultItem = props.relatedResults.find(
      (r) => r.id === urlParams.showDetailPanel
    );
  }
  return (
    resultItem && (
      <div
        className={`container sm:px-11 sm:mb-60 mx-auto bg-white shadow-none aspect-ratio`}
      >
        <div className="flex flex-col sm:flex-row mb-8" id="introCardRow">
          <HeaderRow
            resultItem={resultItem}
            headerIcon={IconMatch(
              resultItem.meta.subject
                ? resultItem.meta.subject.length > 1
                  ? "Composite"
                  : resultItem.meta.subject[0]
                : ""
            )}
            showDetailPanel={props.setShowDetailPanel}
            showSharedLink={props.showSharedLink}
            setShowSharedLink={props.setShowSharedLink}
          />
        </div>
        <div className="flex flex-col sm:flex-row mb-12" id="introCardRow">
          <IntroCard resultItem={resultItem} />
        </div>

        {resultItem.meta.subject && (
          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 sm:gap-8"
            id="iconTagRow"
          >
            {resultItem.meta.subject.map((s, index) => (
              <IconTag
                svgIcon={IconMatch(s)}
                key={index}
                label={s}
                labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
                labelColor={fullConfig.theme.colors["almostblack"]}
                roundBackground={true}
                handleSearch={props.handleSearch}
              />
            ))}
          </div>
        )}

        <div
          className="container pb-2 gap-4 sm:gap-8 border-b border-b-1 border-strongorange rounded"
          id="notesRow"
        >
          {resultItem.meta.display_note &&
            resultItem.meta.display_note.map((s, index) => {
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
          {resultItem.meta.data_usage_notes && (
            <ParagraphCard
              type="usage_tip"
              title="Usage Tip"
              value={resultItem.meta.data_usage_notes}
            />
          )}
        </div>
        <div className="container mt-7 gap-4 sm:gap-8" id="restRow">
          {resultItem.meta.methods_variables && (
            <ParagraphCard
              type="rest"
              title="Methods"
              value={resultItem.meta.methods_variables.join(", ")}
            />
          )}
          {resultItem.meta.data_variables && (
            <ParagraphCard
              type="rest"
              title="Data variables"
              value={resultItem.meta.data_variables.join(", ")}
            />
          )}
          {resultItem.meta.references && (
            <ParagraphCard
              type="references"
              title="Link"
              value={resultItem.meta.references}
            />
          )}
        </div>
      </div>
    )
  );
};

export default DetailPanel;
