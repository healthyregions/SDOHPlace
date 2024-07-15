import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { displayNotesIcons } from "./displayNotesIcons";
import { ParseReferenceLink } from "../../helper/ParseReferenceLink";

interface Props {
  type: string;
  title: string;
  value: string;
}
interface LinkProps {
  value: string | Record<string, any>;
}

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  paragraphCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontSize: "0.875rem",
    marginLeft: "0.25rem",
  },
  link: {
    color: `${fullConfig.theme.colors["frenchviolet"]}`,
  },
}));

const DisplayNote = ({ title, value }) => {
  const classes = useStyles();
  return (
    <div className={`container`}>
      {title ? (
        <span
          dangerouslySetInnerHTML={{ __html: displayNotesIcons[title] }}
          className="mr-1"
        />
      ) : (
        <span
          dangerouslySetInnerHTML={{ __html: "&#x1f4dd;" }}
          className="mr-1"
        />
      )}
      <b>{title ? title : "Notes"}:</b>
      <span className={classes.paragraphCard}>{value}</span>
    </div>
  );
};

const UsageTip = ({ value }) => {
  const classes = useStyles();
  return (
    <div className={`container`}>
      &#128161; <b>Usage Tip:</b>
      <span className={classes.paragraphCard}>{value}</span>
    </div>
  );
};

const Link = ({ value }) => {
  const classes = useStyles();
  const [key, url] = ParseReferenceLink(value);
  return (
    <div className="container">
      <b>Link:</b>
      <a
        href={String(url)}
        className={`${classes.paragraphCard} ${classes.link}`}
      >
        {String(key)}
      </a>
    </div>
  );
};

const ParagraphCard = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={`container mx-auto bg-white shadow-none aspect-ratio mb-6`}>
      {props.type === "display_note" && (
        <DisplayNote title={props.title} value={props.value} />
      )}
      {props.type === "usage_tip" && <UsageTip value={props.value} />}
      {props.type === "references" && <Link value={props.value} />}
      {props.type === "rest" && (
        <div className={`container`}>
          <b>{props.title}:</b>
          <span className={classes.paragraphCard}>{props.value}</span>
        </div>
      )}
    </div>
  );
};

export default ParagraphCard;
