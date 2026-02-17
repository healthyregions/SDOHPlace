"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "@/components/homepage/footer";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import ProfileImage from "@/components/ProfileImage";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { Typography } from "@mui/material";

import team from "../../meta/team.json";
import Link from "next/link";

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

const currentTeam = team.team.filter((p) => p.status == "current");
const pastTeam = team.team.filter((p) => p.status == "past");

const Project: NextPage = () => {
  return (
    <>
      <BasicPageMeta title={"About"} />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 pb-[8rem] max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">About</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  <div style={{ marginBottom: "10px" }}>
                    Finding data about the Social Determinants of Health (SDOH) and community
                    context is tough. The data is often scattered, hard to find, and takes time
                    to learn how to use, especially when it involves integrating geospatial data
                    and then transforming for analysis and communications. The SDOH & Place Project
                    was created to make this process easier. A human-centered design approach centers
                    everything we do around the diverse range of people who need access to this
                    critical SDOH data.
                    <br />
                    <br />
                    With a multidisciplinary team, we’ve crafted multiple resources to help researchers
                    and advocates to explore and understand SDOH data and generate high impact research
                    and advocacy centered in health equity. This includes resources like:
                    <br />
                    <br />
                    <ul className={"list-disc list-inside ml-4"}>
                      <li>
                        Learning how to make your own dashboard with free GIS tools
                        centered around SDOH, community context, and health equity using the{" "}
                        <Link href={'https://toolkit.sdohplace.org'}>
                          Community Toolkit
                        </Link>.
                      </li>
                      <li>
                        Discovering the details of nearly five dozen SDOH datasets for all U.S. communities
                        by topic, place, or time period, with or without AI support, with the{" "}
                        <Link href={'https://search.sdohplace.org'}>Data Discovery</Link>{" "}search tool.
                      </li>
                      <li>
                        <Link href={'/guides'}>Research guides</Link> to dive into the details of
                        measuring community-level SDOH concepts.
                      </li>
                      <li>
                        A new toolkit walking you through the key points of human-centered design
                        as a method for engaging communities when developing apps.
                      </li>
                    </ul>
                    <br />
                    <br />
                    Data offline? You’ll be linked to the{" "}
                    <Link href={'https://uofi.app.box.com/s/fqtslnfkpmgi32pb1cah1eyvmimvp740/folder/304656736187'} target={'_blank'} rel={'noreferrer noopener'}>
                      SDOH Data Refuge
                    </Link>, a collaborative directory that retains copies of critical federal data.
                    <br />
                    <br />
                    The SDOH & Place Project adopts cutting edge spatial data science to support discovery
                    but at its core, the SDOH & Place Project takes a community-driven approach, focusing
                    on real-world impacts and making sure the process of working with this data and making
                    new data applications is open and inclusive. We prioritize collaboration between the
                    people who collect the data, those who analyze it, and the communities it represents.
                    By simplifying access and building shared understanding, the SDOH & Place Project aims
                    to drive better decisions and more equitable health outcomes.
                    <br />
                    <br />
                    The project is based at the Healthy Regions & Policies Lab at the University of Illinois
                    at Urbana-Champaign, with support provided by the Robert Wood Johnson Foundation. Please
                    note: the views expressed here do not necessarily reflect the views of the Foundation.
                    <br />
                    <br />
                    The Healthy Regions & Policies Lab also manages the{" "}
                    <Link href={'https://uscovidatlas.org'} target={'_blank'} rel={'noreferrer noopener'}>US Covid Atlas</Link>,{" "}
                    <Link href={'https://chichives.com'} target={'_blank'} rel={'noreferrer noopener'}>ChiVes</Link>: the Chicago Environment Visualization Explorer,
                    and the <Link href={'https://oeps.healthyregions.org'} target={'_blank'} rel={'noreferrer noopener'}>Opioid Environment Policy Scan</Link> Ecosystem (OEPS). For more details on HeRoP&#39;s research on the social and spatial determinants of health, check out their{" "}
                    <Link href={'https://healthyregions.org'} target={'_blank'} rel={'noreferrer noopener'}>Lab</Link> page.
                  </div>

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

export default Project;
