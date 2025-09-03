import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import mainLogo from "@/public/logos/place-project-logo-hero.svg";
import DataDiscovery from "@/public/logos/data-discovery-icon.svg?component";
import transitIcon from "@/public/logos/transit-icon.svg";
import greenspacesIcon from "@/public/logos/greenspaces.svg";
import educationIcon from "@/public/logos/education-icon.svg";
import workplaceIcon from "@/public/logos/workplace-icon.svg";
import medicalIcon from "@/public/logos/medical-icon.svg";
import housingIcon from "@/public/logos/housing-icon.svg";
import etcIcon from "@/public/logos/etc-icon.svg";
import dataDiscoveryIconEnlarged from "@/public/logos/data-discovery-icon-enlarged.svg";
import communityToolkitIconEnlarged from "@/public/logos/community-toolkit-icon-enlarged.svg";
import heropLogo from "@/public/logos/logo-herop.png";
import rwfjLogo from "@/public/logos/logo-rwjf.png";
import ncsaLogo from "@/public/logos/logo-ncsa.png";
import scdLogo from "@/public/logos/logo-siebel.png";
import uiucLogo from "@/public/logos/logo-uiuc.png";
import sdohGraphic from "@/public/images/sdohGraphic.svg";
import line1 from "@/public/logos/line1.svg";
import line2 from "@/public/logos/line2.svg";
import line3 from "@/public/logos/line3.svg";
import line4 from "@/public/logos/line4.svg";
import line5 from "@/public/logos/line5.svg";
import line6 from "@/public/logos/line6.svg";

import { GetStaticProps } from "next";
import { PostData, getSortedPostsData } from "@/components/Posts";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";
import CardWithImage from "@/components/homepage/cardwithimage/cardwithimage";
import Footer from "@/components/homepage/footer";
import Card from "@/components/homepage/card";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import {Box, Button, Grid, IconButton} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  FaBook,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaPlus, FaStar,
} from "react-icons/fa";
import { Handyman } from "@mui/icons-material";

import featuredData from "../../meta/featured.json";

import styled from "@emotion/styled";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import Head from "next/head";
import {useRouter} from "next/router";

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
const useStyles = makeStyles({
  imageContainer: {
    // display: "flex",
    justifyContent: "center",
    // flexDirection: "row",
    width: "100%",
    "@media (max-width: 959px)": {
      marginLeft: "1em",
    },
  },
  image: {
    // width: "100%",
    // height: "100%",
    // objectFit: "contain",
    // "@media (max-width: 959px)": {
    //   width: "80%",
    //   height: "80%",
    // },
  },
  // For siebel center for design logo only
  largeImage: {
    width: "60%",
    height: "60%",
    objectFit: "contain",
    "@media (max-width: 959px)": {
      width: "50%",
      height: "50%",
    },
  },
});

const FeaturedIcon = () =>
  <>
    <svg width="0" height="0">
      <linearGradient id="featured-icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop stopColor="#7E1CC4" offset="0%" />
        <stop stopColor="#FF9C77" offset="100%" />
      </linearGradient>
    </svg>
    <FaStar style={{
      fill: "url(#featured-icon-gradient)",
      alignSelf: 'center',
      marginRight: '0.5rem',
    }} />
  </>;

const FeaturedImage = styled.img`
  display: block; /* Show by default */
  position: absolute;
  right: 2rem;
  top: -9rem;
  width: 18rem;
  
  @media (max-width: 768px) {
    display: none; /* Hide image on smaller screens */
  }
`;

const FeaturedImageMobile = styled.img`
  position: absolute;
  top: -15rem;
  width: 14rem;
`;

interface Factor {
  id: string|number;
  svgIcon: string;
  title: string;
  text: string;
  link?: string;
}

const HomePage: NextPage<HomePageProps> = ({ newsItem }) => {
  const learnMoreRef = React.useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const sdohFactors: Array<Factor> = [
    {
      id: "0",
      svgIcon: transitIcon,
      title: "Transit",
      text: "Travelers rely on public transit to get to work, school, and essential services. Measuring equity in transit gives insight into the fairness of systems.",
      link: "/guides/public-transit-equity",
    },
    {
      id: "1",
      svgIcon: greenspacesIcon,
      title: "Greenspaces",
      text: "Areas with more trees, parks, and vegetation may provide access to recreation, improve mental health, and combat heat island effects.",
      link: "/guides/greenspace-access",
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
      text: "Access to job opportunities and worker safety all influence population vibrancy and may be linked as structural drivers of health.",
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
      text: "Housing cost, quality, and displacement influence populations at local and regional scales.",
    },
    {
      id: "6",
      svgIcon: etcIcon,
      title: "Etc.",
      text: "Discover more Social Determinants of Health",
      link: "https://sdohplace.org/guides",
    },
  ];

  // TODO: detect edge of scroll width, hide buttons at edge?
  const canNextPage = () => true;
  const canPrevPage = () => true;

  const scrollSize = 265;
  const nextPage = () => canNextPage() && scrollCarousel(scrollSize);
  const prevPage = () => canPrevPage() && scrollCarousel(-scrollSize);
  const carouselRef = useRef();
  const scrollCarousel = (scrollOffset) => {
    const ref: any = carouselRef.current!;
    ref.scrollLeft += scrollOffset;
  };
  function scrollToComingSoon() {
    document
      .getElementById("coming-soon-section")
      .scrollIntoView({ behavior: "smooth" });
  }

  const learnMoreClick = () => {
    learnMoreRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const classes = useStyles();
  const router = useRouter();
  return (
    <>
      <BasicPageMeta />
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
        <div className="absolute right-0 bottom-0 w-[11vw] max-md:[8vw] max-md:hidden  h-auto">
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
          <div className="lg:pb-8 lg:mt-auto max-[460px]:pt-[10vw] min-[460px]:max-[500px]:pt-[15vw] min-[500px]:max-[768px]:pt-[20vw] px-[5%] relative top-[3%] min-[768px]:max-[921px]:top-[-3%]">
            <Image
              priority
              src={mainLogo}
              alt="The SDOH & Place Project logo"
            />
          </div>
          <div
            className="max-md:hidden self-end text-center pr-[20%] mt-auto"
            style={{ cursor: "pointer" }}
            onClick={learnMoreClick}
          >
            <div className="text-frenchviolet text-center text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase">
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

        <div className="flex flex-col gap-8 items-center justify-center px-[5%] max-md:h-fit max-md:mb-[14%]">
          <div className="md:mx-auto max-w-[26.43rem]  max-md:w-full">
            <p className="text-almostblack text-xl font-normal leading-8">
              Discover and learn to wrangle
              {" "}<span className="text-frenchviolet font-bold">place-based data for health equity</span>{" "}
              with design thinking, connecting community-level
              Social Determinants of Health for high impact
              research and advocacy
            </p>
          </div>
          <div className="flex flex-row gap-4 flex-wrap max-[460px]:flex-col max-[460px]:items-center min-[768px]:max-[921px]:flex-col min-[768px]:max-[921px]:items-center ">
            <div>
              <ButtonWithIcon
                noBox={true}
                label={"Data Discovery"}
                fillColor={"salmonpink"}
                labelColor={"almostblack"}
                onClick={() => router.push('/search')}
              ></ButtonWithIcon>
            </div>
            <div>
              <ButtonWithIcon
                noBox={true}
                label={"Community Toolkit"}
                fillColor={"frenchviolet"}
                labelColor={"white"}
                onClick={() => window.open('https://toolkit.sdohplace.org', '_blank')}
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
          <div className="text-almostblack  text-2xl-rfs font-normal leading-8 ml-[2.5%] flex flex-wrap justify-between">
            <div className={'flex-grow py-2'}>Measuring Community-level Social Determinants of Health</div>
            <div className={'flex-row mr-10'}>
              <a href={'/guides'} className={'carousel-link'}>
                <FaBook></FaBook>
                All SDOH Research Guides
              </a>
            </div>
            <div>
              <a href={"https://forms.illinois.edu/sec/1493227735"} className={"carousel-link"} target={'_blank'} rel="noreferrer noopener">
                <FaPlus></FaPlus>
                Create a Guide
              </a>
            </div>
          </div>

          <div className={'flex'}>
            {/* Prev Button */}
            <IconButton
              className={"carousel-icon-button prev-button"}
              onClick={prevPage}
              disabled={!canPrevPage()}
            >
              <FaChevronCircleLeft />
            </IconButton>

            {/* SDOH factors Carousel content */}
            <div className={'overflow-hidden'}>
              <div className={"carousel-container"}>
                <div
                  ref={carouselRef}
                  className={
                    "carousel pt-[3rem] grid grid-flow-col justify-between gap-y-12 gap-x-6 max-md:justify-items-center overflow-x-auto "
                  }
                >
                  {sdohFactors.map((factor: Factor) => (
                    <Card
                      key={factor.id}
                      svgIcon={factor.svgIcon}
                      title={factor.title}
                      text={factor.text}
                      link={factor?.link ? factor.link! : ""}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <IconButton
              className={"carousel-icon-button next-button"}
              onClick={nextPage}
              disabled={!canNextPage()}
            >
              <FaChevronCircleRight />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="w-full h-auto font-[Nunito,sans-serif]" style={{ background: '#ECE6F0' }}>
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto py-[2rem]">
          <div className="text-almostblack text-2xl-rfs font-normal leading-8 ml-[2.5%] max-md:max-w-[16rem]">
            <div className={'flex relative'}>

              {/* Mobile-only version of the FeaturedIcon */}
              <div style={{
                position: 'relative',
                marginTop: '8rem',
                marginBottom: '2rem',
              }}>
                <FeaturedImageMobile  src={featuredData?.image}  />
              </div>

              <div>
                {/* "Featured" section header / icon */}
                <div className={'flex flex-row text-[0.9rem] text-uppercase'} style={{ letterSpacing: '2px' }}>
                  <div className={'flex'} style={{ paddingBottom: '3px' }}><FeaturedIcon /></div> Featured
                </div>

                {/* Featured content title */}
                {/* TODO: support markdown? */}
                <h3 className={'mb-4 text-xl text-extrabold'} style={{ letterSpacing: '0.4pt', fontWeight: '1000' }}>{
                  featuredData?.title || 'Coming Soon' }
                </h3>

                {/* Featured content body */}
                <p className={'mb-6 text-[1rem] tracking-wide'} style={{ lineHeight: '125%' }}>
                  { featuredData?.body || 'Check back later for exciting new features!' }
                </p>

                {/* Actions related to Featured Content */}
                <div>
                  {
                    featuredData?.links?.map((link) =>
                      <div key={`${link.label}-${link?.url}`} item lg={3} xs={12}>
                        {link?.bold && <strong className={'mr-12 text-base'}><a className={'no-underline'} href={link?.url}>{link?.label}</a></strong>}
                        {!link?.bold && <a className={'no-underline mr-12 text-base'} href={link?.url}>{link?.label}</a>}
                      </div>
                    )
                  }
                </div>
              </div>

              {/* Desktop-only version of the FeaturedIcon */}
              <Grid item lg={3} style={{ position: 'relative' }}>
                {/* TODO: image w/ absolute position needs to properly support mobile */}
                <FeaturedImage height={100} src={featuredData?.image}  />
              </Grid>
            </div>
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
              <div className="uppercase text-2xl-rfs font-normal leading-8 text-end">
                <Link
                  href="/news"
                  className={"no-underline text-base font-bold"}
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
                  url={"news/" + item.id.split(".")[0]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-auto bg-frenchviolet sm:px-[1rem] md:px-[4rem]">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto flex-column">
            <div className="my-auto text-white text-left text-l-rfs pt-[4rem] font-normal leading-8 max-md:mt-[2rem]">
                Brought to you by
            </div>
            <Grid container spacing={6} sx={{justifyContent: 'space-between',  alignItems:'center' }}  className="pb-[4rem]">
              <Grid item xs={12} sm={6} md={2}>
                <Link
                  href="http://www.healthyregions.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    alt="Healthy Regions & Policies Lab"
                    src={heropLogo}
                    className={classes.image}
                  />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Link
                  href="https://illinois.edu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    alt="University of Illinois"
                    src={uiucLogo}
                    className={classes.image}
                  />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Link
                  href="https://www.ncsa.illinois.edu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    alt="National Center for Supercomputing Applications"
                    src={ncsaLogo}
                    className={classes.image}
                  />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Link
                  href="https://designcenter.illinois.edu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={`${classes.image} ${classes.largeImage}`}
                    alt="Siebel Center for Design"
                    src={scdLogo}
                  />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Link
                    href="https://www.rwjf.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                    alt="Robert Wood Johnson Foundation"
                    src={rwfjLogo}
                    className={classes.image}
                    />
                </Link>
              </Grid>
            </Grid>
        </div>
      </div>

      <div id="coming-soon-section" className="w-full h-auto">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1536px] mx-auto pt-[5rem] pb-[4rem] flex flex-col gap-12">
          <div className="text-almostblack text-2xl-rfs font-normal leading-8 px-[2.5%]">
            Access Data & Resources
          </div>

          <div className="px-[2.5%]">
            <div
              style={{ marginBottom: "2rem" }}
              className="flex flex-row justify-between flex-wrap items-center gap-y-12 max-[1150px]:flex-col before:border-2 before:border-solid before:border-neutralgray before:self-stretch min-[1150px]:before:[border-image:linear-gradient(to_bottom,white_33%,#CCC_33%,#CCC_75%,white_75%)_1] max-[1149px]:before:[border-image:linear-gradient(to_right,white_5%,#CCC_5%,#CCC_95%,white_95%)_1]"
            >
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
                </div>

                <div className="max-w-[34.0625rem] text-black text-xl-rfs font-normal leading-6 tracking-[0.03125rem]">
                  <p>
                    Looking for community-level SDOH for your project? Explore the
                    Data Discovery search tool, with or without an AI assist, to
                    identify high-quality data across the United States.
                  </p>
                  <br/>
                  <p>
                    Review data availability across topics, spatial scales
                    (i.e. census tract vs county), and time periods alongside usage tips.
                  </p>
                </div>

                <div className="flex flex-row gap-6 items-center">
                  <div className="text-frenchviolet font-nunito text-base-rfs leading-8 tracking-[0.25rem] uppercase text-center">
                    <div>
                      <ButtonWithIcon
                        label={"Data Discovery"}
                        svgIcon={<DataDiscovery />}
                        fillColor={"salmonpink"}
                        labelColor={"almostblack"}
                        onClick={() => {
                          window.location.href = "/search";
                        }}
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
                  <p>
                    Learn how to make your own dashboard (ex. story map, asset map,
                    interactive map or classic dashboard) with open source and/or
                    free GIS tools using the Community Toolkit.
                  </p>
                  <br />
                  <p>
                    Get practice with spatial data for health equity initiatives,
                    and engage human-centered design to build with communities.
                  </p>
                </div>

                <div className="flex flex-row gap-6 items-center">
                  <div>
                    <ButtonWithIcon
                      label={"Community Toolkit"}
                      svgIcon={<Handyman />}
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
      <style>
        {`
          .vertical-center {
            display: flex;
            flex-direction: row;
            align-content: center;
          }
          .carousel-container {
            mask-image:
              linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 1%);
          }
          .carousel {
            overflow-x: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
            mask-image:
              linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 1%);
          }
          .carousel-link-container {
            display: flex;
            align-items: right;
          }
          .carousel-link {
            text-decoration: none;
            display: flex;
            align-items: center;
            font-size: 18px;
            letter-spacing: 0.5px;
            line-height: 24px;

            svg {
              margin-right: 0.5rem;
              vertical-align: middle;
            }
          }
          .carousel-icon-button {
            background-color: transparent !important;
            align-self: center;
            margin-left: auto;
            margin-right: auto;

            svg {
              color: #FF9C77;
              background: #FFE5C4;
            }
          }
          .prev-button {
            display: ${canPrevPage() ? "inherit" : "none"};
          }
          .next-button {
            display: ${canNextPage() ? "inherit" : "none"};
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
