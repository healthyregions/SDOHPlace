import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import Footer from "./footer";
import Image from "next/image";
import Link from "next/link";

import styles from "./homepage.module.css";
import mapWithPinLogo from "@/public/logos/map-with-pin.svg";
import theSDOHPlaceProjectLogo from "@/public/logos/the-sdoh-place-project.svg";
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
import communityToolkitIconBlack from "@/public/logos/community-toolkit-icon-black.svg";
import sdohGraphic from "@/public/images/sdohGraphic.svg";
import line1 from "@/public/logos/line1.svg";
import line2 from "@/public/logos/line2.svg";
import line3 from "@/public/logos/line3.svg";
import line4 from "@/public/logos/line4.svg";
import line5 from "@/public/logos/line5.svg";
import line6 from "@/public/logos/line6.svg";
import newsImage1 from "@/public/images/news1.png";
import newsImage2 from "@/public/images/news2.png";

import ButtonWithIcon from "./buttonwithicon";
import Card from "./card";
import CardWithImage from "./cardwithimage/cardwithimage";

const HomePage: NextPage = () => {
  const sdohFactors = [
    {
      id: "1",
      svgIcon: greenspacesIcon,
      title: "Greenspaces",
      text: "Green spaces may combat urban warming, purify air, offer recreation, and improve mental health by reducing stress and anxiety.",
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
      title: "Greenspaces",
      text: "Expensive housing, limited healthy food access, and neighborhood insecurity harm individuals’ physical and mental health.",
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
      title: "Introducing the SDOH & Place Project",
      text: "What do we mean by SDOH? What will this project provide to the field of health equity? Learn more about the SDOH & Place project in this quick news update.",
      url: "https://sdohplace.org/news/introducing-the-sdoh-place-project",
    },
    {
      id: "2",
      image: newsImage2,
      title: "Meet our Stakeholders!",
      text: "One of the SDOH & Place project’s main features is teaching others how to integrate human-centered design in their projects. Meet the humans behind the SDOH & Place team’s stakeholder board! Learn how they help us make this project better.",
      url: "https://sdohplace.org/news/introducing-our-advisory-boards",
    },
    {
      id: "3",
      image: mapWithPinLogo,
      title: "Community Fellowship—Call for Applications! ",
      text: "Have a project in mind that needs developing, but unsure where to start? Consider joining our funded community fellowship! Here we will teach you how to create your own data dashboard/data visualization in a Human-Centered Design framework!",
      url: "https://sdohplace.org/news/community-fellowship-2024",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="w-full h-screen max-md:h-auto max-md:min-h-[60rem] -z-50 absolute">
        <div className="absolute left-[70%] top-0 w-[13vw] max-md:w-[22vw] max-md:left-[28%] h-auto">
          <Image
            priority
            src={line1}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
        <div className="absolute right-0 top-[2%] w-[11vw] max-md:w-[18vw] max-md:top-[5%] h-auto">
          <Image
            priority
            src={line2}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
        <div className="absolute right-0 top-[43%] w-[5vw] max-md:hidden h-auto">
          <Image
            priority
            src={line3}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
        <div className="absolute right-0 bottom-0 w-[5vw] max-md:w-[8vw] h-auto">
          <Image
            priority
            src={line4}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
        <div className="absolute left-[80%] bottom-0 w-[7vw] max-md:hidden h-auto">
          <Image
            priority
            src={line5}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
        <div className="absolute left-[65%] bottom-0 w-[2vw] max-md:hidden h-auto">
          <Image
            priority
            src={line6}
            alt="The SDOH & Place project logo"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="grid grid-flow-row max-md:grid-rows-[1fr_1fr] max-md:gap-y-[0.5rem] md:grid-flow-col md:grid-cols-[1fr_1fr] w-full h-screen max-md:h-auto max-md:min-h-[60rem]">
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-start sm:mt-auto max-md:pr-[15vw] max-md:pt-[10vw]">
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
          <div className="self-center uppercase text-almostblack font-nunito text-xl-rfs font-normal leading-8 tracking-[0.75rem] relative bottom-[-5%]">
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
        <div className="flex flex-col gap-8 items-center justify-center px-[2.5%]">
          <div className=" mx-auto max-w-[26.43rem] sm:max-md:mt-auto max-md:w-[22rem] text-justify">
            <p className="text-almostblack font-nunito text-2xl-rfs font-normal leading-8">
              A <span className="text-darkorchid font-bold">free platform</span>{" "}
              to discover and practice with place-based data for health equity,
              connecting the Social Determinants of Health to communities,
              researchers, policymakers, & health practitioners.
            </p>
          </div>
          <div className="flex flex-row gap-4 justify-between flex-wrap mx-auto max-[440px]:flex-col max-[440px]:items-center">
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

      <div className="w-full h-auto bg-lightbisque">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem]">
          <div className="text-almostblack  font-nunito text-2xl-rfs font-normal leading-8 ml-[2.5%] max-md:max-w-[16rem]">
            Social Determinants of Health have a Spatial Footprint
          </div>
          <div className="pt-[3rem] grid grid-flow-col justify-around max-md:grid-flow-row max-md:grid-cols-2 gap-y-12 gap-x-6 max-md:justify-items-center ">
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
            <div className="flex flex-row font-nunito justify-between gap-4">
              <div className=" text-2xl-rfs font-normal leading-8">
                News & Updates
              </div>
              <div className=" text-2xl-rfs font-normal leading-8">
                <Link
                  style={{ textTransform: "uppercase", color: "#7e1cc4" }}
                  href="/news"
                >
                  All News & Updates
                </Link>
              </div>
            </div>

            <div className="flex flex-row justify-between flex-wrap gap-12">
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
      </div>

      <div className="w-full h-auto bg-darkorchid">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem] grid grid-flow-row max-md:grid-rows-[1fr_1fr] max-md:gap-y-12 md:grid-flow-col md:grid-cols-[1fr_2fr] text-start">
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
      </div>

      <div className="w-full h-auto px-[2.5%]">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[5rem] flex flex-col gap-12">
          <div className="text-almostblack font-nunito text-2xl-rfs font-normal leading-8">
            Access Data & Resources on SDOH & Place
          </div>

          <div>
            <div className="flex flex-row justify-between flex-wrap items-center gap-y-12 max-[1150px]:flex-col before:border-2 before:border-solid before:border-neutralgray before:self-stretch min-[1150px]:before:[border-image:linear-gradient(to_bottom,white_33%,#AAA_33%,#AAA_75%,white_75%)_1] max-[1149px]:before:[border-image:linear-gradient(to_right,white_5%,#AAA_5%,#AAA_95%,white_95%)_1]">
              <div className="flex flex-col gap-8 -order-1">
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

                <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem] mt-[-1rem]">
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

                  <div className="text-darkorchid font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase text-center">
                    Coming Soon
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

                <div className="text-almostblack font-nunito text-2xl-rfs font-bold leading-8">
                  Data Practice
                </div>

                <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                  Learn how to work with SDOH & Place Data to explore health
                  equity in your community & build your own app.
                </div>

                <div className="max-w-[34.0625rem] text-black font-nunito text-xl-rfs font-normal leading-6 tracking-[0.03125rem] mt-[-1rem]">
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

                  <div className="text-darkorchid font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase text-center">
                    Coming Soon
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

      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
