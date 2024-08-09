import type { NextPage } from "next";
import Image from "next/image";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import Link from "next/link";

const fullConfig = resolveConfig(tailwindConfig);
interface Props {
  image: any;
  title: string;
  text: string;
  url: string;
}

const CardWithImage = (props: Props): JSX.Element => {
  return (
    <div className="flex flex-col items-start">
      <div className="h-[12.9375rem] w-[22.3125rem] relative border-4 border-solid border-salmonpink shadow-[2px_4px_0px_0px_frenchviolet] max-sm:h-[14rem] max-sm:w-[20rem]">
        <Link href={props.url}>
          <Image
            priority
            src={props.image}
            alt={props.title + " image"}
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="text-almostblack text-3xl-rfs font-normal leading-10 max-w-[22.3125rem] mt-[2.31rem]">
        <Link href={props.url} className="no-underline text-black">
          {props.title}
        </Link>
      </div>
      <div className="text-almostblack text-xl-rfs max-w-[22.3125rem] leading-6 tracking-[0.03125rem] mt-[0.69rem]">
        <p>{props.text}</p>
      </div>
      <a
        href={props.url}
        className="text-[0.6875rem] font-bold leading-4 tracking-[0.03125rem] uppercase mt-[1.25rem] no-underline"
      >
        Learn More
      </a>
    </div>
  );
};

export default CardWithImage;
