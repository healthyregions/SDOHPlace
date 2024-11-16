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
  variant: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
  handleSearch(params: any, value: string, filterQueries: any): void;
}

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  iconTag: {
    color: fullConfig.theme.colors["almostblack"],
    fontFamily: fullConfig.theme.fontFamily["sans"],
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

  /* Support new variant color schemes
  *    Default => swaps colors when selected
  *       Icon color =>
  *           Selected => Cream/Bisque color
  *           Not Selected => Orange
  *       Background =>
  *           Selected => Orange
  *           Not Selected => Cream/Bisque color
  *
  *    "alternate" variant => only colors background when selected
  *       Icon color =>
  *           Selected => Orange
  *           Not Selected => Orange
  *       Background =>
  *           Selected => Cream/Bisque color
  *           Not Selected => White
  */
  const getBgColorClass = () => {
    const selected = isSelected(props.label);
    if (props.variant === 'alternate') {
      // Alternate variant
      return selected ? 'bg-lightbisque' : 'bg-white';
    }
    // Default behavior
    return selected ? 'bg-strongorange' : 'bg-lightbisque';
  }
  const getColorName = () => {
    const selected = isSelected(props.label);
    if (props.variant === 'alternate') {
      return 'strongorange';
    }
    return selected ? 'lightbisque' : 'strongorange';
  }
  const getBorderColorClass = () => {
    return 'border-strongorange';
  }

  return (
    <div
      className={`flex items-center shadow-none ${getBgColorClass()}
      border border-1 rounded-[0.5em] py-[0.375em] pl-[0.5em] pr-[1em] space-x-2 ${
        classes.iconTag
      } cursor-pointer ${getBorderColorClass()}`}
      onClick={() => handleSubjectClick(props.label)}
    >
      {props.roundBackground ? (
        <div
          className="relative flex items-center justify-center"
          style={{
            color: `${
              isSelected(props.label)
                ? fullConfig.theme.colors[getColorName()]
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
          color: props.labelColor,
        }}
      >
        {props.label}
      </span>
    </div>
  );
};

export default IconTag;
