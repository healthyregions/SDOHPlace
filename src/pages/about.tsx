"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";

import sdohGraphic from "@/public/images/sdohGraphic.svg";
import Footer from "@/components/homepage/footer";
import Header from "@/components/Header";
import TopLines from "@/components/TopLines";

import people from "../../meta/people.json";

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

const About: NextPage = () => {
  const teamList = [];
  Object.keys(people).map(function (id, keyIndex) {
    const item = people[id];
    item.id = id;
    if (item.category.indexOf("core") >= 0) {
      teamList.push(item);
    }
  });
  const [open, setOpen] = React.useState(false);
  const [bio, setBio] = React.useState("marynia");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Header title={"About"} />
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
                  <img
                    loading="lazy"
                    srcSet={people[bio].image}
                    className="aspect-[0.94] object-cover object-center w-full overflow-hidden"
                    alt={people[bio].name}
                  />
                  <div className="text-2xl font-bold leading-[133.333%] mt-6">
                    {people[bio].name}
                  </div>
                  <div className="text-lg font-medium leading-[177.778%] mt-2.5">
                    {people[bio].affiliation}
                  </div>
                  {Object.keys(people[bio].links).map((id, index) => (
                    <div
                      key={index}
                      className="text-lg font-medium leading-[177.778%] mt-2.5"
                    >
                      <a
                        href={people[bio].links[id]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {id}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-stretch w-9/12 max-md:w-full max-md:ml-0">
                <div className="text-lg font-medium leading-[177.778%] w-[848px] max-w-full max-md:mt-10">
                  {people[bio].long.map((p, index) => (
                    <div
                      key={index}
                      style={{ marginBottom: "10px" }}
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-300 w-full h-1 mt-10" />
        </Box>
      </Modal>
      <div className="flex flex-col">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">About</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-2xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  <p style={{ marginBottom: "10px" }}>
                    The SDOH & Place Project provides access to spatially
                    indexed and curated databases, specifically designed for
                    conducting health equity research. We will achieve this goal
                    by:
                  </p>
                  <ol
                    style={{
                      paddingLeft: "25px",
                      marginBottom: "10px",
                      listStyle: "numbered",
                    }}
                  >
                    <li>
                      Developing and disseminating a toolkit on integrating
                      User-Centered Design principles in place-based web
                      applications.
                    </li>
                    <li>
                      Creating an innovative product for place-based data
                      discovery to link data needed for app development and
                      related neighborhood health data exploration.
                    </li>
                  </ol>
                  <p>
                    Our mission is to make the process of building web
                    applications that support community health by being more
                    accessible, enjoyable, and empowering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-[2.5%] mt-[100px] relative self-center">
          <Image priority src={sdohGraphic} alt="The SDOH & Place graphic" />
        </div>
        <div className="self-center z-[1] flex w-full max-w-[1068px] flex-col mt-[100px] mb-[200px] px-5 max-md:max-w-full max-md:mt-10">
          <div className="self-center text-center w-full max-md:max-w-full text-stone-900 max-w-[1246px] p-[25px] ml-18 max-md:ml-2.5">
            <h2 className="font-fredoka">Core Team</h2>
          </div>
          <p className="text-stone-900 text-2xl leading-8 mt-10 self-center max-w-[1259px] max-md:max-w-full max-md:mt-10">
            Our team is based out of the University of Illinois at
            Urbana-Champaign via Dr. Kolak&apos;s{" "}
            <a
              className="underline"
              href="http://www.healthyregions.org/"
              target="_blank"
              rel="noreferrer"
            >
              Healthy Regions & Policies (HEROP) Lab
            </a>{" "}
            at the Department of Geography & GIScience, and{" "}
            <a
              className="underline"
              href="http://czhai.cs.illinois.edu/"
              target="_blank"
              rel="noreferrer"
            >
              Dr. Zhai&apos;s
            </a>{" "}
            team at the Department of Computer Science.
            <br />
            <br />
            This project is funded in part by the Robert Wood Johnson
            Foundation.
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
                  {teamList.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-stretch w-1/4 p-[25px] mb-[70px] max-md:w-full max-md:ml-0"
                    >
                      <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                        <div
                          className="flex flex-col items-stretch mb-[30px] max-md:w-full max-md:ml-0"
                          style={{ paddingRight: "100px" }}
                        >
                          <img
                            loading="lazy"
                            srcSet={item.image}
                            className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-salmonpink shadow-[2px_4px_0px_0px_frenchviolet]"
                            alt={item.name}
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
                            {item.text}
                          </div>
                          <Button
                            sx={modalBtnStyle}
                            onClick={() => {
                              setBio(item.id);
                              handleOpen();
                            }}
                          >
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-stone-900 py-[50px] text-2xl leading-[133.333%] self-center ml-0 w-[1068px] max-w-[1068px] my-20 max-md:max-w-full max-md:mt-10">
          Spring 2023 research assistants supporting Place metadata
          harmonization and other activites included Elaina Katz, Sarthak Joshi,
          Augustyn Crane, and Jorge Corral.
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
