import { makeStyles } from "@mui/styles";
import * as React from "react";
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "../../../../../meta/interface/SolrObject";
import Image from "next/image";
import DOMPurify from "dompurify";
import CloseIcon from "@mui/icons-material/Close";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import { ParseReferenceLink } from "../../helper/ParseReferenceLink";

interface Props {
  resultItem: SolrObject;
  headerIcon: any;
  showDetailPanel: (value: string) => void;
  showSharedLink: string;
  setShowSharedLink: (value: string) => void;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  introCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
  },
  wide: {
    width: "95%",
  },
}));

const HeaderRow = (props: Props): JSX.Element => {
  const classes = useStyles();
  const backToMapView = (e) => {
    e.preventDefault();
    props.showDetailPanel(null);
  };

  //handle share link
  const handleShowShareLink = () => {
    if (props.showSharedLink === "true") {
      props.setShowSharedLink(null);
    } else props.setShowSharedLink("true");
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("The shared link has been copied to the clipboard successfully!");
  };

  const sanitizedDescription = DOMPurify.sanitize(
    props.resultItem.description,
    {
      ALLOWED_TAGS: ["a", "b", "i", "em", "strong", "p", "div", "span"],
      ALLOWED_ATTR: ["href", "title", "target", "class"],
    }
  );
  return (
    <div className={`container mx-auto shadow-none aspect-ratio`}>
      <div className="flex flex-col sm:mb-5 sm:flex-row">
        <a
          href="#"
          className="text-xl text-frenchviolet font-bold leading-8 sm:mb-1"
          onClick={backToMapView}
          style={{ textDecoration: 'none' }}
        >
          Back to map view
        </a>
      </div>
      <div className="flex flex-col sm:mb-7 sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row items-center flex-grow">
          <div
            className="flex items-center sm:text-[4em]"
            style={{ color: fullConfig.theme.colors["strongorange"] }}
          >
            {React.cloneElement(props.headerIcon, { fontSize: "inherit" })}
          </div>
          <Box
            sx={{ display: "inline" }}
            className={`text-4xl leading-10 ml-[0.5em] ${classes.introCard}`}
          >
            {props.resultItem.title}
          </Box>
        </div>
        <div className="flex items-start justify-center sm:justify-end md:mt-4 sm:mt-0 order-1 sm:order-none flex-none">
          <div className="mr-7">
            <ButtonWithIcon
              label={"Share"}
              borderRadius={"0"}
              noBox={true}
              noHover={true}
              width={"100%"}
              justifyContent="space-between"
              fillColor={"white"}
              labelColor={"frenchviolet"}
              onClick={handleShowShareLink}
            />
          </div>
          <ButtonWithIcon
            label={"Access"}
            borderRadius={"0.25rem"}
            width={"100%"}
            justifyContent="space-between"
            fillColor={"frenchviolet"}
            labelColor={"white"}
            noBox={true}
            onClick={() => {
              const link = ParseReferenceLink(
                props.resultItem.meta.references
              )[1]
                ? String(
                    ParseReferenceLink(props.resultItem.meta.references)[1]
                  )
                : "#";
              window.open(link, "_blank");
            }}
          />
        </div>
      </div>
      {props.showSharedLink && (
        <div className={`flex w-full p-0 ${classes.introCard}`}>
          <div
            className={`flex ${classes.wide}  flex-11 sm:justify-between sm:items-center sm:px-[1em] sm:py-[0.5em] sm:my-[1.5em]`}
            style={{
              fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
              backgroundColor: fullConfig.theme.colors["lightbisque"],
              borderRadius: "0.5em 0 0 0.5em",
            }}
          >
            <div className="flex flex-col">
              <div className="flex sm:flex-start sm:items-center">
                <IconButton
                  sx={{
                    width: "0.875em",
                    color: fullConfig.theme.colors["frenchviolet"],
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => props.setShowSharedLink(null)}
                >
                  <CloseIcon />
                </IconButton>
                <p style={{ marginLeft: "2em" }}>Share link:</p>
              </div>
              <div className="flex font-bold sm:flex-start sm:items-center sm:mb-[0.5em] sm:ml-[3.4em]">
                <p>{window.location.href}</p>
              </div>
            </div>
          </div>
          <div
            className="flex items-center justify-center sm:p-[1.5em] sm:my-[1.5em]"
            style={{
              background: fullConfig.theme.colors["strongbisque"],
              borderRadius: "0 0.5em 0.5em 0",
            }}
          >
            <IconButton
              sx={{
                padding: 0,
                color: fullConfig.theme.colors["frenchviolet"],
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleCopyLink}
            >
              <CopyAllIcon
                sx={{
                  fontSize: "2em",
                }}
              />
            </IconButton>
          </div>
        </div>
      )}
      {props.resultItem.description ? (
        <div className="flex flex-col sm:flex-row items-center">
          <div
            className="text-base"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      ) : null}
    </div>
  );
};
export default HeaderRow;
