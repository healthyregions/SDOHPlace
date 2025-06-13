"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "@/components/homepage/footer";
import Header from "@/components/meta/Header";
import ProfileImage from "@/components/ProfileImage";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";

import team from "../../meta/team.json";

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

const useStyles = makeStyles(() => ({
  modalBtnStyle: {
    marginTop: "10px",
    cursor: "pointer",
  },
}));

const currentTeam = team.team.filter((p) => p.status == "current");
const pastTeam = team.team.filter((p) => p.status == "past");

const Team: NextPage = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(currentTeam[0]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Header title={"Team"} />
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
                    src={modalData.image}
                    alt={modalData.name}
                    rounded={false}
                  />
                  <div className="text-2xl font-bold leading-[133.333%] mt-6">
                    {modalData.name}
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-2.5">
                    {modalData.title}
                  </div>
                  {modalData.links?.map((link, index) => (
                    <div
                      key={index}
                      className="text-lg font-medium leading-[177.778%] mt-2.5"
                    >
                      <a
                        href={link.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-salmonpink no-underline hover:underline"
                      >
                        <Typography>{link.link_label}</Typography>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-stretch w-9/12 max-md:w-full max-md:ml-0">
                <div className="text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: modalData.desc_long,
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
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 pb-[8rem] max-md:max-w-full mt-[100px]">
          <div className="self-center w-full max-md:max-w-full text-stone-900 max-w-[1246px] ml-18 max-md:ml-2.5">
            <h1 className="font-fredoka">Core Team</h1>
          </div>
          <p className="text-stone-900 text-xl leading-8 mt-10 self-center max-w-[1259px] max-md:max-w-full max-md:mt-10">
            Based at the University of Illinois Urbana-Champaign,
            The SDOH & Place Project team is led by Dr. Marynia Kolak’s
            {" "}<a href={'http://www.healthyregions.org/'} target={'_blank'} rel={'noreferrer noopener'}>
              Healthy Regions & Policies (HEROP) Lab
            </a>{" "}in the Department of Geography & GIScience, and by{" "}
            <a href={'http://czhai.cs.illinois.edu/'} target={'_blank'} rel={'noreferrer noopener'}>
              Dr. ChengXiang Zhai&#39;s team
            </a>{" "}at the Department of Computer Science.

            <br />
            <br />

            This project is funded in part by the
            {" "}<a href={'https://www.rwjf.org/'} target={'_blank'} rel={'noreferrer noopener'}>
              Robert Wood Johnson Foundation
            </a>.
          </p>
        </div>
        <div className="self-stretch flex mt-0 w-full flex-col max-md:max-w-full">
          <div className="bg-lightbisque self-stretch flex w-full flex-col px-5 max-md:max-w-full">
            <div
              className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
              style={{ marginTop: "-110px" }}
            >
              <div className="self-center w-full max-md:max-w-full">
                <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                  {currentTeam.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                    >
                      <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                        <div
                          className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                          style={{
                            paddingRight: "100px",
                          }}
                        >
                          <ProfileImage
                            src={item.image}
                            alt={item.name}
                            rounded={true}
                          />
                        </div>
                        <div className="flex grow flex-col max-md:mt-10">
                          <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                            {item.name}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                            {item.title}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                            {item.desc_short}
                          </div>
                          <div
                            className={`text-frenchviolet text-left text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase ${classes.modalBtnStyle}`}
                            onClick={() => {
                              setModalData(item);
                              handleOpen();
                            }}
                          >
                            Read More
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-center z-[1] flex w-full max-w-[1068px] flex-col mt-[100px] mb-[120px] px-5 max-md:max-w-full max-md:mt-10">
          <div className="self-center text-center w-full max-md:max-w-full text-stone-900 max-w-[1246px] p-[25px] ml-18 max-md:ml-2.5">
            <h2 className="font-fredoka">Past Team Members</h2>
          </div>
        </div>
        <div className="self-stretch flex mt-0 w-full flex-col max-md:max-w-full">
          <div className="bg-lightbisque self-stretch flex w-full flex-col px-5 max-md:max-w-full">
            <div
              className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
              style={{ marginTop: "-110px" }}
            >
              <div className="self-center w-full max-md:max-w-full">
                <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                  {pastTeam.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                    >
                      <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                        <div
                          className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                          style={{
                            paddingRight: "100px",
                          }}
                        >
                          <ProfileImage
                            src={item.image}
                            alt={item.name}
                            rounded={true}
                          />
                        </div>
                        <div className="flex grow flex-col max-md:mt-10">
                          <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                            {item.name}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                            {item.title}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                            {item.desc_short}
                          </div>
                          <div
                            className={`text-frenchviolet text-left text-[0.6875rem] leading-4 font-bold tracking-[0.03125rem] uppercase ${classes.modalBtnStyle}`}
                            onClick={() => {
                              setModalData(item);
                              handleOpen();
                            }}
                          >
                            Read More
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-stone-900 py-[50px] text-xl leading-[133.333%] self-center ml-0 w-[1068px] max-w-[1068px] mb-20 max-md:max-w-full max-md:mt-10 max-md:px-5">
          Spring 2023 research assistants supporting Place metadata
          harmonization and other activites included Elaina Katz, Sarthak Joshi,
          Augustyn Crane, and Jorge Corral.
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Team;
