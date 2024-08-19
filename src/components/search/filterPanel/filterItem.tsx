import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IconText from "../iconText";
import { SolrObject } from "meta/interface/SolrObject";
import IconMatch from "../helper/IconMatch";
import { useEffect, useState } from "react";
import FilterObject from "../interface/FilterObject";
import { generateFilter } from "../helper/FilterHelpMethods";
import CheckBoxObject from "../interface/CheckboxObject";

interface Props {
  resultList: SolrObject[];
  attributeList: string[];
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  filterItem: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
    paddingBottom: "0.5rem",
  },
}));

const FilterItem = (props: Props): JSX.Element => {
  const classes = useStyles();
  const [checkboxes, setCheckboxes] = useState([]);
  const [sRCheckboxes, setSRCheckboxes] = useState(new Set<CheckBoxObject>());
  const constructFilter = props.attributeList.map((filter) => {
    return {
      [filter]: {},
    };
  });
  const [currentFilter, setCurrentFilter] = useState(
    constructFilter as unknown as FilterObject
  );
  useEffect(() => {
    const generateFilterFromCurrentResults = generateFilter(
      props.resultList,
      checkboxes,
      props.attributeList
    );
    console.log(
      generateFilterFromCurrentResults,
      "generateFilterFromCurrentResults"
    );
    setCurrentFilter(generateFilterFromCurrentResults);
    console.log(currentFilter, "currentFilter");
  }, []);

  return (
    props.resultList.length > 0 && (
      <div
        className={`container mx-auto p-5 bg-lightbisque shadow-none rounded-sm aspect-ratio`}
      >
        <div className="flex flex-col sm:flex-row items-center mb-2">
          <div className="flex flex-col sm:flex-row items-center w-full">
            <div className="w-full sm:w-4/5 flex items-center"></div>
            <div className="sm:w-1/5 order-1 sm:order-none w-full sm:ml-auto flex items-center justify-center sm:justify-end">
              <button
                style={{ color: fullConfig.theme.colors["frenchviolet"] }}
              >
                View <span className="ml-1">&#8594;</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:mt-4">
          <div className="flex-1 w-full sm:w-1/2">
            <div className={`${classes.filterItem} truncate `}>test</div>
            <div className={`${classes.filterItem} truncate `}>test</div>
            <div className={`${classes.filterItem} truncate `}>test</div>
          </div>
          <div className="flex-1 w-full sm:w-1/2 sm:pl-8">test</div>
        </div>
      </div>
    )
  );
};

export default FilterItem;
