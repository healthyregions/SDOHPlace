"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "@/components/homepage/footer";
import Header from "@/components/Header";
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

const About: NextPage = () => {
  return (
    <>
      <Header title={"About"} />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 pb-[8rem] max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">About</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
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
        <Footer />
      </div>
    </>
  );
};

export default About;
