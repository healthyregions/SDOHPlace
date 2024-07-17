import { makeStyles } from "@mui/styles";
import * as React from "react";
import { useRouter } from "next/router";
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { SolrObject } from "../../../../../meta/interface/SolrObject";
import { updateSearchParams } from "../../helper/ManageURLParams";
import Image from "next/image";
import DOMPurify from 'dompurify';
import { Box } from "@mui/material";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import { ParseReferenceLink } from "../../helper/ParseReferenceLink";
import ShareModal from "./shareModal";

interface Props {
  resultItem: SolrObject;
  headerIcon: any;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  introCard: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
  },
}));

const HeaderRow = (props: Props): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const backToMapView = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    const currentParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    updateSearchParams(
      router,
      currentParams,
      currentPath,
      "show",
      props.resultItem.id,
      "remove"
    );
  };

  /** Share ShareModal */
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState("");
  const handleOpenShareModal = () => {
    setCurrentUrl(window.location.href);
    setOpenShareModal(true);
  };
  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  return (
    <div className={`container mx-auto shadow-none aspect-ratio`}>
      <div className="flex flex-col sm:mb-5 sm:flex-row">
        <a
          href="#"
          className="text-xl text-frenchviolet font-bold leading-8 sm:mb-1"
          onClick={backToMapView}
        >
          Back to map view
        </a>
      </div>
      <div className="flex flex-col sm:mb-7 sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row items-center flex-grow">
          <Image
            src={props.headerIcon}
            alt="Icon"
            className="w-10 h-10 text-4xl"
          />
          <Box
            sx={{ display: "inline" }}
            className={`text-4xl leading-8 ml-6 ${classes.introCard}`}
          >
            {props.resultItem.title}
          </Box>
        </div>
        <div className="flex items-center justify-center sm:justify-end md:mt-4 sm:mt-0 order-1 sm:order-none flex-none">
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
              onClick={handleOpenShareModal}
            />
          </div>
          <ShareModal
            open={openShareModal}
            onClose={handleCloseShareModal}
            currentUrl={currentUrl}
          />
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

      {props.resultItem.description ? (
        <div className="flex flex-col sm:flex-row items-center">
          <div className="text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.resultItem.description) }} />
        </div>
      ) : null}
    </div>
  );
};
export default HeaderRow;
