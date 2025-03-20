"use client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/homepage/footer";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import { AiOutlineClose } from "react-icons/ai";
import { Typography } from "@mui/material";

import Header from "@/components/meta/Header";
import ProfileImage from "@/components/ProfileImage";
import TopLines from "@/components/TopLines";
import people from "../../meta/people.json";

import fellowsData from "../../meta/fellows.json";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1068px",
  maxHeight: "100vh",
  color: `${fullConfig.theme.colors["white"]}`,
  bgcolor: `${fullConfig.theme.colors["almostblack"]}`,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  paddingTop: "10px",
  overflowY: "auto",
};

const modalBtnStyle = {
  marginTop: "10px",
  fontSize: "1em",
  fontWeight: 700,
  width: "unset",
  color: `${fullConfig.theme.colors["frenchviolet"]}`,
  textTransform: "uppercase",
};

const useStyles = makeStyles(() => ({
  modalBtnStyle: {
    marginTop: "10px",
    cursor: "pointer",
  },
}));

const Fellows: NextPage = () => {
  // Map of cohort to fellows in the cohort
  // This will be built up when the view loads
  const fellows = {};

  const classes = useStyles();
  // Fellow all cohorts in the CMS system and group them by cohort
  fellowsData.fellows.forEach((fellow) => {
    // Add to the running list of fellows if this is not already present
    fellows[fellow.cohort] = fellows[fellow.cohort] || [];
    fellows[fellow.cohort]?.includes(fellow) || fellows[fellow.cohort].push(fellow);
  });
  const [firstCohort] = Object.keys(fellows);

  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(fellows[firstCohort][0]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sortByYearAndSeason = (cohorts) => {
    return cohorts.sort((c1, c2) => {
      const [s1, y1] = c1.split(' ');
      const [s2, y2] = c2.split(' ');

      // Main comparison uses year
      if (y1 > y2) { return 1; }
      if (y2 < y1) { return -1; }

      // Break ties in year using season
      if (s1 > s2) { return 1; }
      if (s2 < s1) { return -1; }

      // Same year, same season => same cohort
      return 0;
    });
  }

  return (
    <>
      <Header title={"Fellowship Program"} />
      <NavBar />
      <TopLines />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <div>
            <Button
              sx={{
                minWidth: "unset",
                padding: 0,
                float: "right",
                marginBottom: "10px",
              }}
              onClick={handleClose}
            >
              <AiOutlineClose size={25} color="white" />
            </Button>
          </div>
          <div className="bg-orange-300 clear-both max-w-[1068px] h-1 max-md:max-w-full max-h-full" />
          <div className="self-center w-full mt-10 max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                <div className="flex flex-col max-md:mt-10">
                  <ProfileImage
                    src={modalData?.image}
                    alt={modalData?.name}
                    rounded={false}
                  />
                  <div className="text-2xl font-bold leading-[133.333%] mt-6">
                    {modalData?.name}
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-2.5">
                    {modalData?.title}
                  </div>
                  {modalData?.links?.map((link, index) => (
                    <div
                      key={index}
                      className="text-lg font-medium leading-[177.778%] mt-2.5"
                    >
                      <a
                        href={link?.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-salmonpink no-underline hover:underline"
                      >
                        <Typography>{link?.link_label}</Typography>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-stretch w-9/12 max-md:w-full max-md:ml-0">
                <div className="text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: modalData?.desc_long,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-300 w-full h-1 mt-10" />
        </Box>
      </Modal>
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">Fellowship Program</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  The{" "}
                  <Link href="https://sdohplace.org/news/community-fellowship-2024">
                    SDOH & Place Fellowship Program
                  </Link>{" "}
                  launched in 2024 to support public health, geography, & health
                  equity leaders learn how to develop a social determinants of
                  health (SDOH) place-based visualization (e.g., asset map,
                  story map, thematic map, or dashboard) based on a
                  human-centered design (HCD) framework and participatory design
                  principles. Program Ambassadors additionally contribute to the
                  SDOH & Place community toolkit&apos;s design and development.
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          sortByYearAndSeason(Object.keys(fellows)).map((cohort, index) =>
            <div className="self-stretch flex flex-col mt-10 max-md:max-w-full max-md:mr-0.5 max-md:mt-10" key={`cohort-${cohort}-${index}`}>
              <div className="self-center text-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] p-[25px] ml-18 max-md:ml-2.5">
                <h2 className="font-fredoka">{cohort} Fellow Cohort</h2>
              </div>
              <div className="bg-lightbisque self-stretch flex grow flex-col px-5 max-md:max-w-full">
                <div className="self-center flex w-full max-w-[1246px] flex-col max-md:max-w-full">
                  <div
                    className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
                    style={{ marginTop: "-110px" }}
                  >
                    <div className="self-center w-full max-md:max-w-full">
                      <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                        {
                          fellows[cohort]?.map((fellow, index) =>
                            <div
                              key={`fellow-${cohort}-${index}`}
                              className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                            >
                              <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                                <div
                                  className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                                  style={{ paddingRight: "100px" }}
                                >
                                  <ProfileImage
                                    src={fellow.image}
                                    alt={fellow.name}
                                    rounded={true}
                                  />
                                </div>
                                <div className="flex grow flex-col max-md:mt-10">
                                  <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                                    {fellow.name}
                                  </div>
                                  <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                                    {fellow.title}
                                  </div>
                                  <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                                    {fellow.desc_short}
                                  </div>
                                  <div
                                    className={`text-frenchviolet text-left text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase ${classes.modalBtnStyle}`}
                                    onClick={() => {
                                      setModalData(fellow);
                                      handleOpen();
                                    }}
                                  >
                                    Read More
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <Footer />
      </div>
    </>
  );
};

export default Fellows;
