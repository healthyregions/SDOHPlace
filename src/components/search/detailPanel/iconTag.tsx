import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import Image from "next/image";

interface Props {
  svgIcon: any;
  label: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
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
  const classes = useStyles();
  return (
    <div
      className={`flex items-center shadow-none bg-lightbisque border border-1 border-strongorange rounded py-1.5 px-2 space-x-2 ${classes.iconTag}`}
    >
      {props.roundBackground ? (
        <div className="relative flex items-center justify-center">
          <Image src={props.svgIcon} alt="Icon" className="w-6 h-6" />
        </div>
      ) : (
        // for single icon without background
        <Image src={props.svgIcon} alt="Icon" className="w-6 h-6" />
      )}
      <span
        className={`${props.labelClass} truncate`}
        style={{ color: props.labelColor }}
      >
        {props.label}
      </span>
    </div>
  );
};

export default IconTag;
