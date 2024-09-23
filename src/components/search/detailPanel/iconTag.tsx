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
  handleInputReset: () => void;
  handleSearch(params: any, value: string, filterQueries: any): void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  iconTag: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
  },
}));

const IconTag = (props: Props): JSX.Element => {
  let params = GetAllParams();
  const classes = useStyles();
  const handleSubjectClick = (sub: string) => {
    let filterQueries = [{ attribute: "subject", value: "sub" }];
    updateAll(params, null, null, filterQueries, "*");
    params.setQuery("*");
    params.setSubject(sub);
    props.handleSearch(reGetFilterQueries(params), "*", filterQueries);
    props.handleInputReset();
  };
  return (
    <div
      className={`flex items-center shadow-none bg-lightbisque border border-1 border-strongorange rounded-[0.5em] py-[0.375em] pl-[0.5em] pr-[1em] space-x-2 ${classes.iconTag}  cursor-pointer`}
      onClick={() => handleSubjectClick(props.label)}
    >
      {props.roundBackground ? (
        // for icon with background as the theme tags.
        <div
          className="relative flex items-center justify-center"
          style={{ color: `${fullConfig.theme.colors["strongorange"]}` }}
        >
          {props.svgIcon}
        </div>
      ) : (
        <div>{props.svgIcon}</div>
      )}
      <span
        className={`${props.labelClass}`}
        style={{ color: props.labelColor }}
      >
        {props.label}
      </span>
    </div>
  );
};

export default IconTag;
