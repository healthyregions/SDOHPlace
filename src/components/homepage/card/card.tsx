import type { NextPage } from "next";
import Image from "next/image";
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
    <div
      className={`flex flex-col items-start gap-4 ${
        props.title === "Etc." ? "justify-self-start" : ""
      }`}
    >
      <div className="h-[3rem] w-[3.8125rem]">
        <Image priority src={props.svgIcon} alt={props.title + " icon"} />
      </div>
      <div className="text-almostblack text-2xl-rfs font-bold leading-8">
        {props.title}
      </div>
      <div className="text-almostblack text-xl-rfs max-w-[11.0625rem] leading-6 tracking-[0.03125rem]">
        {props.link ? (
          props.link.length > 0 ? (
            <a href={props.link} target="blank" className="text-frenchviolet">
              <p className="pr-[1em]">{props.text}</p> <ArrowRightAltIcon />
            </a>
          ) : (
            <p>{props.text}</p>
          )
        ) : (
          <p>{props.text}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
