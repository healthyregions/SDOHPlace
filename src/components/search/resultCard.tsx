import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IconText from "./iconText";

interface Props {
  title: string;
  subject: string[];
  creator: string;
  publisher: string;
  index_year: string[];
  spatial_resolution: string[];
  resource_class: string[];
  icon: any;
  link: string;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  resultCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
    paddingBottom: "0.5rem",
  },
}));

const ResultCard = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div
      className={`container mx-auto p-5 bg-lightbisque shadow-none rounded-sm overflow-hidden aspect-ratio`}
    >
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <div className="flex flex-col sm:flex-row items-center w-full">
          <IconText
            roundBackground={true}
            svgIcon={props.icon}
            label={props.title}
            labelClass={`text-l font-medium ${fullConfig.theme.fontFamily["sans"]}`}
            labelColor={fullConfig.theme.colors["almostblack"]}
          />
          <div className="md:mt-4 sm:mt-0 order-1 sm:order-none w-full sm:ml-auto">
            <a
              href={props.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center sm:justify-end"
              style={{ color: fullConfig.theme.colors["frenchviolet"] }}
            >
              View <span className="ml-1">&#8594;</span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 w-full sm:w-1/2">
          <div className={`${classes.resultCard} truncate mb-1 md:mb-4 `}>
            Subject: {props.subject[0]}
          </div>
          <div className={`${classes.resultCard} truncate mb-1 md:mb-4`}>
            Creator: {props.creator}
          </div>
          <div className={`${classes.resultCard} truncate mb-1 md:mb-0`}>
            Publisher: {props.publisher}
          </div>
        </div>
        <div className="flex-1 w-full sm:w-1/2 sm:pl-8">
          <div className={`${classes.resultCard} truncate mb-1 md:mb-4`}>
            Year: {props.index_year.join(", ")}
          </div>
          <div className={`${classes.resultCard} truncate mb-1 md:mb-4`}>
            Spatial Res: {props.spatial_resolution[0]}
          </div>
          <div className={`${classes.resultCard} truncate`}>
            Resource: {props.resource_class[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
