import { makeStyles } from "@mui/styles";
import * as React from "react";
import DOMPurify from "dompurify";
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { displayNotesIcons } from "./displayNotesIcons";
import { ParseReferenceLink } from "../../helper/ParsingMethods";
import { List, ListItem } from "@mui/material";

interface Props {
  type: string;
  title: string;
  value: string;
  collapsible?: boolean;
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
      <span
        className={classes.paragraphCard}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
      />
    </div>
  );
};

const UsageTip = ({ value }) => {
  const classes = useStyles();
  return (
    <div className={`container`}>
      &#128161; <b>Usage Tip:</b>
      <span
        className={classes.paragraphCard}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
      />
    </div>
  );
};

const Link = ({ value }) => {
  const classes = useStyles();
  const links = ParseReferenceLink(value);
  if (links.downloadUrl || links.dataDictionaryUrl || links.archiveUrl) {
    return (
      <div className="container">
        <b className="text-s">More links:</b>
        <ul className={'py-2'}>
          {links.downloadUrl && (
            <li><a
              href={String(links.downloadUrl)}
              className={`${classes.paragraphCard} ${classes.link}`}
            >Data Download (Official)</a></li>)
          }
          {links.archiveUrl && (
            <li><a
              href={String(links.archiveUrl)}
              className={`${classes.paragraphCard} ${classes.link}`}
            >Data Archival Copy</a></li>)
          }
          {links.dataDictionaryUrl && (
            <li><a
              href={String(links.dataDictionaryUrl)}
              className={`${classes.paragraphCard} ${classes.link}`}
            >Technical Documentation</a></li>)
          }
        </ul>
      </div>
    )
  } else {
    return <></> ;
  }
};

const ParagraphCard = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div className="container mx-auto bg-white shadow-none aspect-ratio mb-6">
      {props.type === "display_note" && (
        <DisplayNote title={props.title} value={props.value} />
      )}
      {props.type === "usage_tip" && <UsageTip value={props.value} />}
      {props.type === "references" && <Link value={props.value} />}
      {props.type === "rest" && (
        <div className={`container`}>
          {props.collapsible ? (
            <details>
              <summary className="text-s"><b>{props.title}</b></summary>
            <span className={classes.paragraphCard}>{props.value}</span>
            </details>
          ) : (
            <>
            <b className="text-s">{props.title}</b>{" "}
          <span className={classes.paragraphCard}>{props.value}</span>
            </>
          )
          }
        </div>
      )}
    </div>
  );
};

export default ParagraphCard;
