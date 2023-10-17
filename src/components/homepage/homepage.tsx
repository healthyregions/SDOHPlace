import type { NextPage } from "next";
import NavBar from "./navbar";
import Image from "next/image";

import styles from "./homepage.module.css";
import mapWithPinLogo from "../../../public/logos/map-with-pin.svg";
import theSDOHPlaceProjectLogo from "../../../public/logos/the-sdoh-place-project.svg";
import dataDiscoveryIcon from "../../../public/logos/data-discovery-icon.svg";
import communityToolkitIcon from "../../../public/logos/community-toolkit-icon.svg";
import greenspacesIcon from "../../../public/logos/greenspaces.svg";
import educationIcon from "../../../public/logos/education-icon.svg";
import workplaceIcon from "../../../public/logos/workplace-icon.svg";
import medicalIcon from "../../../public/logos/medical-icon.svg";
import housingIcon from "../../../public/logos/housing-icon.svg";
import etcIcon from "../../../public/logos/etc-icon.svg";

import newsImage1 from "../../../public/images/news-1.png";
import newsImage2 from "../../../public/images/news-2.png";
import newsImage3 from "../../../public/images/news-3.png";

import ButtonWithIcon from "./buttonwithicon";
import Card from "./card";
import CardWithImage from "./cardwithimage/cardwithimage";

const HomePage: NextPage = () => {
  const sdohFactors = [
    {
      id: "1",
      svgIcon: greenspacesIcon,
      title: "Greenspaces",
      text: "Factors like where people are born, live, learn, work, play, worship, & age that affect a range of health outcomes.",
    },
    {
      id: "2",
      svgIcon: educationIcon,
      title: "Education",
      text: "Factors like where people are born, live, learn, work, play, worship, & age that affect a range of health outcomes.",
    },
    {
      id: "3",
      svgIcon: workplaceIcon,
      title: "Workplace",
      text: "Factors like where people are born, live, learn, work, play, worship, & age that affect a range of health outcomes.",
    },
    {
      id: "4",
      svgIcon: medicalIcon,
      title: "Medical",
      text: "Factors like where people are born, live, learn, work, play, worship, & age that affect a range of health outcomes.",
    },
    {
      id: "5",
      svgIcon: housingIcon,
      title: "Greenspaces",
      text: "Factors like where people are born, live, learn, work, play, worship, & age that affect a range of health outcomes.",
    },
    {
      id: "6",
      svgIcon: etcIcon,
      title: "Etc.",
      text: " ",
    },
  ];

  const newsItems = [
    {
      id: "1",
      image: newsImage1,
      title: "Fresh updates on User Centered Design Survey",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      url: "",
    },
    {
      id: "2",
      image: newsImage2,
      title: "We're delighted to present you our advisory board",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      url: "",
    },
    {
      id: "3",
      image: newsImage3,
      title: "Introducing the world to The SDOH & Place Project",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      url: "",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="grid grid-flow-row max-md:grid-rows-[1fr_1fr] md:grid-flow-col md:grid-cols-[1fr_1fr] w-full h-screen">
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-start mt-auto">
            <div className="my-auto flex-shrink relative top-[-2%]">
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
          <div className="self-center uppercase text-almostblack font-nunito text-[1.5rem] font-normal leading-8 tracking-[0.75rem]">
            Coming Soon
          </div>
          <div className="max-md:hidden self-center text-center pr-[8%] mt-auto">
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
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className=" mx-auto max-w-[26.43rem] max-md:mt-auto">
            <p className="text-gray font-nunito text-[1.5rem] font-normal leading-8">
              A <span className="text-darkorchid font-bold">free platform</span>{" "}
              to discover and practice with place-based data for health equity,
              connecting the Social Determinants of Health to communities,
              researchers, policymakers, & health practitioners.
            </p>
          </div>
          <div className="flex flex-row gap-4 justify-between mx-auto">
            <div>
              <ButtonWithIcon
                label={"Data Discovery"}
                svgIcon={dataDiscoveryIcon}
                fillColor={"lightsalmon"}
                labelColor={"almostblack"}
              ></ButtonWithIcon>
            </div>
            <div>
              <ButtonWithIcon
                label={"Community Toolkit"}
                svgIcon={communityToolkitIcon}
                fillColor={"darkorchid"}
                labelColor={"white"}
              ></ButtonWithIcon>
            </div>
            <div></div>
          </div>
          <div className="md:hidden self-center text-center mt-auto">
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
          </div>
        </div>
      </div>

      <div className="w-full min-h-[33rem] bg-lightbisque">
        <div className="text-almostblack pt-[5rem] font-nunito text-2xl-rfs font-normal leading-8 ml-[2.5%]">
          Social Determinants of Health have a Spatial Footprint
        </div>
        <div className="pt-[5rem] grid grid-flow-col justify-around max-md:grid-flow-row max-md:grid-cols-2 gap-y-8 gap-x-4 max-md:justify-items-center max-md:items-start">
          {sdohFactors.map((factor) => (
            <Card
              key={factor.id}
              svgIcon={factor.svgIcon}
              title={factor.title}
              text={factor.text}
            />
          ))}
        </div>
      </div>

      <div className="w-full min-h-[45rem]">
        <div className="flex flex-col my-[5rem] px-[2.5%] gap-10">
          <div className="flex flex-row justify-start gap-4">
            <div className="text-almostblack font-nunito text-2xl-rfs font-normal leading-8">
              News & Updates
            </div>
            <div className="ml-auto text-darkorchid font-nunito text-[0.6875rem] uppercase font-bold leading-4 tracking-[0.03125rem]">
              All News & Updates
            </div>
          </div>

          <div className="flex flex-row mt-[2.56rem] justify-between flex-wrap">
            {newsItems.map((newsItem) => (
              <CardWithImage
                key={newsItem.id}
                image={newsItem.image}
                title={newsItem.title}
                text={newsItem.text}
                url={newsItem.url}
              />
            ))}
          </div>
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
