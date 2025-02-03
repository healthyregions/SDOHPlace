import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IntroCard from "./introCard";
import ParagraphCard from "./paragraphCard/paragraphCard";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import IconMatch from "../helper/IconMatch";
import HeaderRow from "./headerRow";
import IconTag from "./iconTag";

interface Props {
  resultList: any[];
  relatedList: any[];
}
const fullConfig = resolveConfig(tailwindConfig);

const DetailPanel = (props: Props): JSX.Element => {
  const { showDetailPanel } = useSelector((state: RootState) => state.ui);
  let resultItem = props.resultList.find((r) => r.id === showDetailPanel);
  if (!resultItem) {
    resultItem = props.relatedList.find((r) => r.id === showDetailPanel);
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
          />
        </div>
        <div className="flex flex-col sm:flex-row mb-12" id="introCardRow">
          <IntroCard resultItem={resultItem} />
        </div>

        {resultItem.meta.subject && (
          <div
            className="flex flex-col flex-wrap sm:flex-row gap-4 mb-12 sm:gap-8"
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
          {resultItem.meta.featured_variable && (
            <ParagraphCard
              type="rest"
              title="Featured variable(s)"
              value={resultItem.meta.featured_variable}
            />
          )}
            {resultItem.meta.data_variables && (
              <ParagraphCard
                type="rest"
                title="What's in this dataset?"
                value={resultItem.meta.data_variables.join(", ")}
                collapsible={true}
              />
            )}
          {resultItem.meta.methods_variables && (
            <ParagraphCard
              type="rest"
              title="Measures and data input"
              value={resultItem.meta.methods_variables.join(", ")}
              collapsible={true}
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
