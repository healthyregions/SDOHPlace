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
import dataDiscoveryIconEnlarged from "../../../public/logos/data-discovery-icon-enlarged.svg";
import communityToolkitIconEnlarged from "../../../public/logos/community-toolkit-icon-enlarged.svg";
import communityToolkitIconBlack from "../../../public/logos/community-toolkit-icon-black.svg";

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

      <div className="w-full min-h-[16rem] bg-darkorchid grid grid-flow-row max-md:grid-rows-[1fr_1fr] md:grid-flow-col md:grid-cols-[1fr_2fr] text-start">
        <div className="my-auto text-white font-nunito text-2xl-rfs font-normal leading-8 px-[5.5%]">
          Brought to you by
        </div>
        <div className="grid grid-flow-col grid-cols-[1fr_1fr]">
          <img
            className="mx-auto md:my-auto w-[14.75rem] max-h-[3.25rem] max-md:w-[7.8125rem] max-md:h-[1.75rem]"
            alt="Herop light logo"
            src="/logos/herop-light-logo.svg"
          />
          <img
            className="mx-auto md:my-auto w-[12.5625rem] h-[3.1875rem] max-md:w-[6.6875rem] max-md:h-[1.6875rem]"
            alt="University wordmark"
            src="/logos/university-wordmark.svg"
          />
        </div>
      </div>

      <div className="flex flex-col w-full min-h-[67.44rem] pt-[5rem] px-[2.5%] gap-14">
        <div className="text-almostblack font-nunito text-2xl-rfs font-normal leading-8">
          Access Data & Resources on SDOH & Place
        </div>

        <div>
          <div className="flex flex-row justify-between flex-wrap items-center before:border-2 before:border-solid before:border-neutralgray before:self-stretch">
            <div className="flex flex-col gap-10 -order-1">
              <div className="w-[3.5rem] h-[3.5rem]">
                <Image
                  priority
                  src={dataDiscoveryIconEnlarged}
                  alt="Data Discovery Enlarged icon"
                />
              </div>

              <div className="text-almostblack font-nunito text-2xl-rfs font-bold leading-8">
                Data Discovery
              </div>

              <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                Find free, high-quality SDOH Data by Topic and/or Location
                within rural, suburban, or urban U.S. places
              </div>

              <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem] relative top-[-2%]">
                Our data discovery platform makes it easier to discover SDOH
                data according to...
              </div>

              <div className="flex flex-row gap-6 items-center">
                <ButtonWithIcon
                  svgIcon={dataDiscoveryIcon}
                  label="Data Discovery"
                  fillColor="neutralgray"
                  labelColor="almostblack"
                />

                <div className="text-darkorchid font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase">
                  Coming Soon
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div className="w-[3.5rem] h-[3.5rem]">
                <Image
                  priority
                  src={communityToolkitIconEnlarged}
                  alt="Data Practice Enlarged icon"
                />
              </div>

              <div className="text-almostblack font-nunito text-2xl-rfs font-bold leading-8">
                Data Practice
              </div>

              <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                Learn how to work with SDOH & Place Data to explore health
                equity in your community & build your own app.
              </div>

              <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem] relative top-[-2%]">
                Our community toolkit ensures you have easy access to
                harmonized...
              </div>

              <div className="flex flex-row gap-6 items-center">
                <ButtonWithIcon
                  svgIcon={communityToolkitIconBlack}
                  label="Community Toolkit"
                  fillColor="neutralgray"
                  labelColor="almostblack"
                />

                <div className="text-darkorchid font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[500px]"></div>
      </div>
    </>
  );
};

export default HomePage;
