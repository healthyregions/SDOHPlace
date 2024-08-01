import { makeStyles } from "@mui/styles";
import { useSearchParams, usePathname } from "next/navigation";
import * as React from "react";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import IconText from "../iconText";
import { updateSearchParams } from "../helper/ManageURLParams";
import { useRouter } from "next/router";
import { SolrObject } from "meta/interface/SolrObject";
import IconMatch from "../helper/IconMatch";

interface Props {
  resultItem: SolrObject;
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

  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();

  const handleItemDetailButton = (value) => {
    updateSearchParams(
      router,
      searchParams,
      currentPath,
      "show",
      value,
      "overwrite"
    );
  };
  return (
    props.resultItem && (
      <div
        className={`container mx-auto p-5 bg-lightbisque shadow-none rounded-sm aspect-ratio`}
        style={{
          borderRadius:
            searchParams.get("show") === props.resultItem.id
              ? "4px"
              : undefined,
          border:
            searchParams.get("show") === props.resultItem.id
              ? `1px solid ${fullConfig.theme.colors["strongorange"]}`
              : undefined,
          background:
            searchParams.get("show") === props.resultItem.id
              ? `${fullConfig.theme.colors["lightbisque"]}`
              : undefined,
          boxShadow:
            searchParams.get("show") === props.resultItem.id
              ? "0px 4px 4px 0px lightgray"
              : undefined,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center mb-2">
          <div className="flex flex-col sm:flex-row items-center w-full">
            <div className="w-full sm:w-4/5 flex items-center">
              <IconText
                roundBackground={true}
                svgIcon={IconMatch("dataDiscoveryIcon")} // this needs to be updated once we have the full match
                label={props.resultItem.title}
                labelClass={`text-l font-medium ${fullConfig.theme.fontFamily["sans"]}`}
                labelColor={fullConfig.theme.colors["almostblack"]}
              />
            </div>
            <div className="sm:w-1/5 order-1 sm:order-none w-full sm:ml-auto flex items-center justify-center sm:justify-end">
              <button
                onClick={() => {
                  handleItemDetailButton(props.resultItem.id);
                }}
                style={{ color: fullConfig.theme.colors["frenchviolet"] }}
              >
                View <span className="ml-1">&#8594;</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:mt-4">
          <div className="flex-1 w-full sm:w-1/2">
            <div className={`${classes.resultCard} truncate `}>
              Subject:{" "}
              {props.resultItem.meta.subject
                ? props.resultItem.meta.subject[0]
                : ""}
            </div>
            <div className={`${classes.resultCard} truncate `}>
              Creator:{" "}
              {props.resultItem.creator
                ? props.resultItem.creator.join(", ")
                : ""}
            </div>
            <div className={`${classes.resultCard} truncate `}>
              Publisher:{" "}
              {props.resultItem.meta.publisher
                ? props.resultItem.meta.publisher[0]
                : ""}
            </div>
          </div>
          <div className="flex-1 w-full sm:w-1/2 sm:pl-8">
            <div className={`${classes.resultCard} truncate `}>
              Year:{" "}
              {props.resultItem.index_year
                ? props.resultItem.index_year.join(", ")
                : ""}
            </div>
            <div className={`${classes.resultCard} truncate `}>
              Spatial Res:{" "}
              {props.resultItem.meta.spatial_resolution
                ? props.resultItem.meta.spatial_resolution.join(", ")
                : ""}
            </div>
            <div className={`${classes.resultCard} truncate`}>
              Resource:{" "}
              {props.resultItem.resource_class
                ? props.resultItem.resource_class.join(", ")
                : ""}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ResultCard;
