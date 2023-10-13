import type { NextPage } from "next";
import NavBar from "./navbar";
import Image from "next/image";

import styles from "./homepage.module.css";
import mapWithPinLogo from "../../../public/logos/map-with-pin.svg";
import theSDOHPlaceProjectLogo from "../../../public/logos/the-sdoh-place-project.svg";
import dataDiscoveryIcon from "../../../public/logos/data-discovery-icon.svg";
import ButtonWithIcon from "./buttonwithicon";


const HomePage: NextPage = () => {
  return (
    <>
      <NavBar />
      <div className="grid grid-flow-row max-md:grid-rows-[1fr_1fr] md:grid-flow-col md:grid-cols-[1fr_1fr] w-full h-screen">
        <div className="flex items-center justify-start">
          <div className="my-auto flex-shrink">
            <Image
              priority
              src={mapWithPinLogo}
              alt="The SDOH & Place project logo"
            />
          </div>
          {/* <div className=" border-red-500 border-2 my-auto text-[#AAA] font-fredoka text-[5rem] min-[1565px]:text-[5.5rem] min-[1639px]:text-[6rem] font-normal leading-normal
          tracking-[0.5rem] max-w-[35.938rem] min-w-0 flex-shrink p-8">
            <p>The 
            SDOH &
            Place
            Project</p>
          </div> */}
          <div className="p-4">
            <Image
              priority
              src={theSDOHPlaceProjectLogo}
              alt="The SDOH & Place project logo"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className=" mx-auto max-w-[26.43rem]">
            <p className="text-gray font-nunito text-[1.5rem] font-normal leading-8">
              A <span className="text-darkorchid font-bold">free platform</span>{" "}
              to discover and practice with place-based data for health equity,
              connecting the Social Determinants of Health to communities,
              researchers, policymakers, & health practitioners.
            </p>
          </div>
          <div className="flex flex-row gap-4 justify-between">
            <div>
              <ButtonWithIcon></ButtonWithIcon>
            </div>
            <div>
            </div>
          </div>

          {/* <div className="self-end text-center pr-[8%] mt-auto">
            <div className="text-darkorchid text-center font-nunito-sans text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase">
              Learn More
            </div>
            <div className="mx-auto w-[1.25rem] h-[1.25rem]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
              >
                <path
                  d="M9 15L0.339745 0L17.6603 0L9 15Z"
                  className="fill-darkorchid"
                />
              </svg>
            </div>
          </div> */}
        </div>
      </div>
      <div className="w-full min-h-[16rem] bg-darkorchid grid grid-flow-row max-md:grid-rows-[3fr_2fr_2fr_2fr] md:grid-flow-col md:grid-cols-[3fr_2fr_2fr_2fr] text-center">
        <div className="my-auto text-white font-nunito-sans text-[1.5rem] font-bold leading-8">
          Brought to you by
        </div>
        <img
          className="max-md:mx-auto md:my-auto"
          alt="Herop light logo"
          src="/logos/herop-light-logo.svg"
        />
        <img
          className="max-md:mx-auto md:my-auto"
          alt="University wordmark"
          src="/logos/university-wordmark.svg"
        />
        <div className="w-[12.0625rem] h-[3.5rem] bg-mediumpurple max-md:mx-auto md:my-auto"></div>
      </div>
      <div className="w-full min-h-[24rem] grid grid-flow-row max-md:grid-rows-2 md:grid-flow-col md:grid-cols-2">
        <div className="border-r-2">1</div>
        <div>2 hello</div>
      </div>
    </>
  );
};

export default HomePage;
