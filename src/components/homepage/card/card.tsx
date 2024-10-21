import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const fullConfig = resolveConfig(tailwindConfig);
interface Props {
  svgIcon: any;
  title: string;
  text: string;
  link?: string;
}

const Card = (props: Props): JSX.Element => {
  return (
    <button
      className={`group flex flex-col items-start gap-2 rounded-lg p-8 w-[15rem] ${
        props.title === "Etc." ? "justify-self-start" : ""
      } ${props.link ? "hover:bg-salmonpink" : "cursor-default"}`}
      onClick={() => {
        props.link ? (window.location.href = props.link) : "";
      }}
    >
      <div className="h-[3rem] w-[3.8125rem]">
        <Image priority src={props.svgIcon} alt={props.title + " icon"} />
      </div>
      <div className="text-almostblack text-2xl-rfs font-bold leading-8">
        {props.title}
      </div>
      <div className="font-bold">
        {props.link ? (
          <p className="text-frenchviolet group-hover:text-lightbisque">
            Learn more
          </p>
        ) : (
          <p className="text-neutralgray">Coming soon...</p>
        )}
      </div>
      <div className="text-almostblack text-xl-rfs leading-6 tracking-[0.03125rem]">
        <p className="text-start">{props.text}</p>
      </div>
    </button>
  );
};

export default Card;
