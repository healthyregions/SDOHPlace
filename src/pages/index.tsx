import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

import mainLogo from "@/public/logos/place-project-logo-hero.svg";
import dataDiscoveryIcon from "@/public/logos/data-discovery-icon.svg";
import communityToolkitIcon from "@/public/logos/community-toolkit-icon.svg";
import greenspacesIcon from "@/public/logos/greenspaces.svg";
import educationIcon from "@/public/logos/education-icon.svg";
import workplaceIcon from "@/public/logos/workplace-icon.svg";
import medicalIcon from "@/public/logos/medical-icon.svg";
import housingIcon from "@/public/logos/housing-icon.svg";
import etcIcon from "@/public/logos/etc-icon.svg";
import dataDiscoveryIconEnlarged from "@/public/logos/data-discovery-icon-enlarged.svg";
import communityToolkitIconEnlarged from "@/public/logos/community-toolkit-icon-enlarged.svg";
import heropLightLogo from "@/public/logos/herop-light-logo.svg";
import universityWordmark from "@/public/logos/university-wordmark.svg";
import csdsLogo from "@/public/logos/CSDS-white-reduce.png";
import sdohGraphic from "@/public/images/sdohGraphic.svg";
import line1 from "@/public/logos/line1.svg";
import line2 from "@/public/logos/line2.svg";
import line3 from "@/public/logos/line3.svg";
import line4 from "@/public/logos/line4.svg";
import line5 from "@/public/logos/line5.svg";
import line6 from "@/public/logos/line6.svg";

import { GetStaticProps } from "next";
import Header from "@/components/Header";
import { PostData, getSortedPostsData } from "@/components/Posts";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import CardWithImage from "@/components/homepage/cardwithimage/cardwithimage";
import Footer from "@/components/homepage/footer";
import Card from "@/components/homepage/card";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { Box } from "@mui/material";

const fullConfig = resolveConfig(tailwindConfig);

interface HomePageProps {
  newsItem: PostData[];
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  let newsItem = getSortedPostsData();

  // Convert date to string format
  newsItem = newsItem.map((item) => {
    return {
      ...item,
      date: new Date(item.date).toISOString(), // Converts to ISO string format
      // or use .toLocaleDateString() for a more human-readable format
    };
  });

  return {
    props: {
      newsItem,
    },
  };
};

const HomePage: NextPage<HomePageProps> = ({ newsItem }) => {
  const learnMoreRef = React.useRef(null);
  const sdohFactors = [
    {
      id: "1",
      svgIcon: greenspacesIcon,
      title: "Greenspaces",
      text: "Greenspaces may combat urban heat island effects, purify air, offer recreation, and improve mental health by reducing stress and anxiety.",
    },
    {
      id: "2",
      svgIcon: educationIcon,
      title: "Education",
      text: "Improved access to education can help in reducing health disparities by increasing job opportunities and income.",
    },
    {
      id: "3",
      svgIcon: workplaceIcon,
      title: "Workplace",
      text: "At work, exposure to toxins and exploitation detrimentally impacts health, especially among vulnerable groups.",
    },
    {
      id: "4",
      svgIcon: medicalIcon,
      title: "Medical",
      text: "Affordable and equitable healthcare access is essential for the well-being of communities.",
    },
    {
      id: "5",
      svgIcon: housingIcon,
      title: "Housing",
      text: "Expensive housing, limited healthy food access, and neighborhood insecurity harm individuals' physical and mental health.",
    },
    {
      id: "6",
      svgIcon: etcIcon,
      title: "Etc.",
      text: " ",
    },
  ];

  function scrollToComingSoon() {
    document
      .getElementById("coming-soon-section")
      .scrollIntoView({ behavior: "smooth" });
  }

  const learnMoreClick = () => {
    learnMoreRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Header title={null} />
      <NavBar />
      <div className="w-full h-screen max-md:h-auto max-md:min-h-[60rem] -z-50 absolute">
        <div className="absolute left-[70%] top-0 w-[13vw] max-md:w-[22vw] max-md:left-[28%] h-auto">
          <Image priority src={line1} alt="" className="w-full h-full" />
        </div>
        <div className="absolute right-0 top-[2%] w-[11vw] max-md:w-[18vw] max-md:top-[5%] h-auto">
          <Image priority src={line2} alt="" className="w-full h-full" />
        </div>
        <div className="absolute right-0 top-[43%] w-[5vw] max-[1150px]:hidden h-auto">
          <Image priority src={line3} alt="" className="w-full h-full" />
        </div>
        <div className="absolute right-0 bottom-0 w-[5vw] max-md:[8vw] max-md:hidden  h-auto">
          <Image priority src={line4} alt="" className="w-full h-full" />
        </div>
        <div className="absolute left-[80%] bottom-0 w-[7vw] max-md:hidden h-auto">
          <Image priority src={line5} alt="" className="w-full h-full" />
        </div>
        <div className="absolute left-[65%] bottom-0 w-[2vw] max-md:hidden h-auto">
          <Image priority src={line6} alt="" className="w-full h-full" />
        </div>
      </div>

      <div className="grid grid-flow-row max-md:grid-rows-[1fr_1fr] max-md:gap-y-[0.1rem] md:grid-flow-col md:max-[921px]:grid-cols-[1fr_1fr] min-[921px]:grid-cols-[2fr_3fr] w-full h-screen max-md:h-auto  2xl:max-w-[1536px] 2xl:mx-auto">
        <div className="flex flex-col justify-center items-center max-md:max-w-[26.43rem] max-md:mx-auto">
          <div className="mt-auto max-[460px]:pt-[10vw] min-[460px]:max-[500px]:pt-[15vw] min-[500px]:max-[768px]:pt-[20vw] px-[5%] relative top-[3%] min-[768px]:max-[921px]:top-[-3%]">
            <Image
              priority
              src={mainLogo}
              alt="The SDOH & Place Project logo"
            />
          </div>
          <div className="max-md:hidden self-end text-center pr-[20%] mt-auto">
            <div
              className="text-frenchviolet text-center text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase"
              style={{ cursor: "pointer" }}
              onClick={learnMoreClick}
            >
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
                  className="fill-frenchviolet"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 items-center justify-center px-[5%] max-md:h-fit max-md:mt-[15%]">
          <div className="md:mx-auto max-w-[26.43rem]  max-md:w-full">
            <p className="text-almostblack text-2xl-rfs font-normal leading-8">
              A{" "}
              <span className="text-frenchviolet font-bold">free platform</span>{" "}
              to discover and practice with place-based data for health equity,
              connecting the Social Determinants of Health to communities,
              researchers, policymakers, & health practitioners.
            </p>
          </div>
          <div className="flex flex-row gap-4 flex-wrap max-[460px]:flex-col max-[460px]:items-center min-[768px]:max-[921px]:flex-col min-[768px]:max-[921px]:items-center ">
            <div>
              <ButtonWithIcon
                label={"Data Discovery"}
                svgIcon={dataDiscoveryIcon}
                fillColor={"salmonpink"}
                labelColor={"almostblack"}
                onClick={scrollToComingSoon}
              ></ButtonWithIcon>
            </div>
            <div>
              <ButtonWithIcon
                label={"Community Toolkit"}
                svgIcon={communityToolkitIcon}
                fillColor={"frenchviolet"}
                labelColor={"white"}
                onClick={scrollToComingSoon}
              ></ButtonWithIcon>
            </div>
          </div>
        </div>
        <div className="md:hidden text-center">
          <div className="text-frenchviolet text-center text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase max-[460px]:mt-[7%]">
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
                className="fill-frenchviolet"
              />
            </svg>
          </div>
        </div>
      </div>

      <div ref={learnMoreRef} className="w-full h-auto bg-lightbisque">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem]">
          <div className="text-almostblack  text-2xl-rfs font-normal leading-8 ml-[2.5%] max-md:max-w-[16rem]">
            Social Determinants of Health
          </div>
          <div className="pt-[3rem] grid grid-flow-col justify-between px-[2.5%] max-md:grid-flow-row max-md:grid-cols-2 gap-y-12 gap-x-6 max-md:justify-items-center ">
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
      </div>

      <div className="w-full h-auto">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem]">
          <div className="flex flex-col px-[2.5%] gap-12">
            <div className="flex flex-row justify-between gap-4">
              <div className=" text-2xl-rfs font-normal leading-8">
                News & Updates
              </div>
              <div className=" text-2xl-rfs font-normal leading-8 text-end">
                <Link
                  style={{
                    textTransform: "uppercase",
                    color: `${fullConfig.theme.colors["frenchviolet"]}`,
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                  href="/news"
                >
                  All News & Updates
                </Link>
              </div>
            </div>

            <div className="flex flex-row justify-between flex-wrap gap-12 max-[803px]:flex-col max-[803px]:items-center">
              {newsItem.map((item) => (
                <CardWithImage
                  key={item.id}
                  image={item.thumbnail}
                  title={item.title}
                  text={item.excerpt}
                  url={"news/" + item.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-auto bg-frenchviolet">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem] grid grid-flow-row md:grid-flow-col md:grid-cols-[1fr_2fr] text-start">
          <div className="my-auto text-white text-2xl-rfs font-normal leading-8 px-[5.5%] max-md:mb-[2rem] ">
            Brought to you by
          </div>
          <div className="flex flex-col md:grid md:grid-flow-col md:grid-cols-[1fr_1fr] items-center">
            <div className="mx-auto md:my-auto w-[14.75rem] max-h-[3.25rem] max-md:w-[7.8125rem] max-md:h-[1.75rem] max-md:mb-[2rem]">
              <Link
                href="http://www.healthyregions.org/"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  alt="Healthy Regions & Policies Lab"
                  src={heropLightLogo}
                />
              </Link>
            </div>
            <div className="mx-auto md:my-auto w-[12.5625rem] h-[3.1875rem] max-md:w-[6.6875rem] max-md:h-[1.6875rem] max-md:mb-[2rem]">
              <Link
                href="https://illinois.edu/"
                target="_blank"
                rel="noreferrer"
              >
                <Image alt="University of Illinois" src={universityWordmark} />
              </Link>
            </div>
            <div className="mx-auto md:my-auto w-[12.5625rem] h-[3.1875rem] max-md:w-[6.6875rem] max-md:h-[1.6875rem] max-md:mb-[2rem]">
              <Link
                href="https://spatial.uchicago.edu/"
                target="_blank"
                rel="noreferrer"
              >
                <Image alt="Center for Spatial Data Science" src={csdsLogo} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="coming-soon-section" className="w-full h-auto">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto pt-[5rem] pb-[4rem] flex flex-col gap-12">
          <div className="text-almostblack text-2xl-rfs font-normal leading-8 px-[2.5%]">
            Access Data & Resources
          </div>

          <div className="px-[2.5%]">
            <div style={{marginBottom: "2rem"}} className="flex flex-row justify-between flex-wrap items-center gap-y-12 max-[1150px]:flex-col before:border-2 before:border-solid before:border-neutralgray before:self-stretch min-[1150px]:before:[border-image:linear-gradient(to_bottom,white_33%,#CCC_33%,#CCC_75%,white_75%)_1] max-[1149px]:before:[border-image:linear-gradient(to_right,white_5%,#CCC_5%,#CCC_95%,white_95%)_1]">
              <div className="flex flex-col gap-8 -order-1">
                <div className="w-[3.5rem] h-[3.5rem]">
                  <Image
                    priority
                    src={dataDiscoveryIconEnlarged}
                    alt="Data Discovery Enlarged icon"
                  />
                </div>

                <div className="text-almostblack text-2xl-rfs leading-8">
                  <b>Data Discovery </b>
                  <em style={{ color: "grey" }}> &mdash; coming soon!</em>
                </div>

                <div className="max-w-[34.0625rem] text-black text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                  Our data discovery platform provides access to spatially
                  indexed and curated databases, specifically designed for
                  conducting health equity research.
                </div>

                <div className="flex flex-row gap-6 items-center">
                  <div className="text-frenchviolet font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase text-center">
                    <div>
                      <ButtonWithIcon
                        label={"Data Discovery"}
                        svgIcon={dataDiscoveryIcon}
                        fillColor={"salmonpink"}
                        labelColor={"almostblack"}
                        onClick={scrollToComingSoon}
                        disabled={true}
                        iconOpacity={0.25}
                      ></ButtonWithIcon>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="w-[3.5rem] h-[3.5rem]">
                  <Image
                    priority
                    src={communityToolkitIconEnlarged}
                    alt="Data Practice Enlarged icon"
                  />
                </div>

                <div className="text-almostblack text-2xl-rfs font-bold leading-8">
                  Community Toolkit
                </div>

                <div className="max-w-[34.0625rem] text-black text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                  Enhance your health and equity initiatives with our toolkit.
                  You will be able to create captivating spatial visualizations
                  for community engagement using free and user-friendly tools
                  including open-source GIS tools.
                </div>

                <div className="flex flex-row gap-6 items-center">
                  <div>
                    <ButtonWithIcon
                      label={"Community Toolkit"}
                      svgIcon={communityToolkitIcon}
                      fillColor={"frenchviolet"}
                      labelColor={"white"}
                      onClick={() => {
                        window.location.href = "https://toolkit.sdohplace.org";
                      }}
                    ></ButtonWithIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative self-center">
            <Image priority src={sdohGraphic} alt="The SDOH & Place graphic" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
