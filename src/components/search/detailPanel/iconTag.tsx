import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { batchResetFilters, setQuery, setSubject } from "@/store/slices/searchSlice";
import {EventType} from "@/lib/event";
import {usePlausible} from "next-plausible";

interface Props {
  themeOnly?: boolean;
  svgIcon: any;
  label: string;
  variant?: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
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
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const { subject, schema } = useSelector((state: RootState) => state.search);
  const handleSubjectClick = (sub: string) => {
    let currentSubjects = subject || [];
    let newSubjects: string[];
    if (currentSubjects.includes(sub)) {
      newSubjects = currentSubjects.filter((s) => s !== sub);
    } else {
      newSubjects = [...currentSubjects, sub];
    }
    if (props.themeOnly) {
      dispatch(batchResetFilters({
        schema: schema,
        query: "*",
        preserveSubject: true,
        subject: newSubjects
      }));
    } else {
      dispatch(setSubject(newSubjects));
    }
    
    plausible(EventType.ChangedThemeFilter, {
      props: {
        themes: newSubjects.join(", "),
      },
    });
  };

  const isSelected = (label: string): boolean => {
    let currentSubjects = subject || [];
    return currentSubjects.includes(label);
  };
  const getBgColorClass = () => {
    const selected = isSelected(props.label);
    if (props.variant === "alternate") {
      return selected ? "bg-lightbisque" : "bg-white";
    }
    return selected ? "bg-strongorange" : "bg-lightbisque";
  };
  const getColorName = () => {
    const selected = isSelected(props.label);
    if (props.variant === "alternate") {
      return "strongorange";
    }
    return selected ? "lightbisque" : "strongorange";
  };
  const getBorderColorClass = () => {
    return "border-strongorange";
  };

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
