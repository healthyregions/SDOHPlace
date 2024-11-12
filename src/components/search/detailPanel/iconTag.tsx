import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import {
  GetAllParams,
  reGetFilterQueries,
  updateAll,
} from "../helper/ParameterList";

interface Props {
  svgIcon: any;
  label: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
  handleSearch(params: any, value: string, filterQueries: any): void;
}

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  iconTag: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontSize: "0.875rem",
  },
}));

const IconTag = (props: Props): JSX.Element => {
  let params = GetAllParams();
  const classes = useStyles();

  const handleSubjectClick = (sub: string) => {
    let filterQueries = reGetFilterQueries(params);
    let currentSubjects = params.subject
      ? params.subject.split(",").map((s) => s.trim())
      : [];
    let newSubjects: string[];
    if (currentSubjects.includes(sub)) {
      newSubjects = currentSubjects.filter((s) => s !== sub);
    } else {
      newSubjects = [...currentSubjects, sub];
    }
    const subjectString = newSubjects.length > 0 ? newSubjects.join(",") : "";
    filterQueries = filterQueries.filter(
      (query) => query.attribute !== "subject"
    );
    if (subjectString) {
      filterQueries.push({ attribute: "subject", value: subjectString });
    }
    const currentQuery = params.query ? params.query : "*";
    updateAll(params, null, null, filterQueries, currentQuery);
    params.setQuery(currentQuery);
    params.setSubject(subjectString);
    props.handleSearch(reGetFilterQueries(params), currentQuery, filterQueries);
  };

  const isSelected = (label: string): boolean => {
    const currentSubjects =
      typeof params.subject === "string"
        ? params.subject.split(",").map((s) => s.trim())
        : params.subject
        ? (params.subject as string[]).map((s) => s.trim())
        : [];
    return currentSubjects.includes(label);
  };

  return (
    <div
      className={`flex items-center shadow-none bg-lightbisque border border-1 rounded-[0.5em] py-[0.375em] pl-[0.5em] pr-[1em] space-x-2 ${
        classes.iconTag
      } cursor-pointer ${
        isSelected(props.label) ? "border-frenchviolet" : "border-strongorange"
      }`}
      onClick={() => handleSubjectClick(props.label)}
    >
      {props.roundBackground ? (
        <div
          className="relative flex items-center justify-center"
          style={{
            color: `${
              isSelected(props.label)
                ? fullConfig.theme.colors["frenchviolet"]
                : fullConfig.theme.colors["strongorange"]
            }`,
          }}
        >
          {props.svgIcon}
        </div>
      ) : (
        <div>{props.svgIcon}</div>
      )}
      <span
        className={`${props.labelClass}`}
        style={{
          color: isSelected(props.label)
            ? `${fullConfig.theme.colors["frenchviolet"]}`
            : props.labelColor,
          fontWeight: isSelected(props.label) ? 900 : 400,
        }}
      >
        {props.label}
      </span>
    </div>
  );
};

export default IconTag;
