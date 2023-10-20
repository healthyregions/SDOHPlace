import type { NextPage } from "next";
import Image from "next/image";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

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
      <div className="h-[12.9375rem] w-[22.3125rem] relative border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]">
        <Image
          priority
          src={props.image}
          alt={props.title + " image"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="text-almostblack font-nunito text-3xl-rfs font-normal leading-10 max-w-[22.3125rem] mt-[2.31rem]">
        {props.title}
      </div>
      <div className="text-almostblack font-nunito text-xl-rfs max-w-[22.3125rem] leading-6 tracking-[0.03125rem] mt-[0.69rem]">
        <p>{props.text}</p>
      </div>
      <div className="text-darkorchid font-nunito text-[0.6875rem] font-bold leading-4 tracking-[0.03125rem] uppercase mt-[1.25rem]">
        Learn More
      </div>
    </div>
  );
};

export default CardWithImage;
