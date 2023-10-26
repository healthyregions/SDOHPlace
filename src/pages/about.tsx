"use client";
import NavBar from "@/components/homepage/navbar";
import * as React from "react";
import Image from "next/image";

import sdohGraphic from "../../public/logos/sdoh-graphic.svg";
import Footer from "@/components/homepage/footer";

import TopLines from "../components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

function About(props) {
  const data = {
    about: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                    in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est laborum`,
    team: [
      {
        name: "Marynia Kolak",
        title: "Principal Investigator",
        image: "../../images/df007028baf7b7ca9ffe91f5659363e7.png",
        text: `Marynia is a health geographer & spatial data scientist integrating a 
                        socio-ecological view of health, geographic data science, and a human-centered 
                        design approach to investigate ...`,
        link: "",
      },
      {
        name: "Chengxiang Zhai",
        title: "Co-Investigator",
        image: "../../images/ff29d87381caf6b52758a79bd3be0677.png",
        text: `ChengXiang Zhai is a Donald Biggar Willett Professor in 
                        Engineering of the Department of Computer Science at the University 
                        of Illinois at Urbana-Champaign, where he is also affiliated ...`,
        link: "",
      },
      {
        name: "José Alavez",
        title: "Postdoctoral Scholar",
        image: "../../images/c7abfd78a936d535ffaad9d2777f8985.png",
        text: `José holds a Ph.D. in Geography from Concordia University (Montreal). 
                        His research integrates diverse contemporary mapping theories and practices 
                        to gain insights into human ...`,
        link: "",
      },
      {
        name: "Kamaria Barronville",
        title: "Instructional Designer",
        image: "../../images/d5afa2beb30bb9c60b8cd0c03584abcf.png",
        text: `Kamaria is pursuing her doctoral degree in Urban Educational Leadership 
                        at Morgan State University. Drawing on her interdisciplinary expertise, 
                        Kamaria focuses on bridging ...`,
        link: "",
      },
      {
        name: "Shubham Kumar",
        title: "Product Designer",
        image: "../../images/1004ed3fea6fa62c54d452ac1900cecb.png",
        text: `Shubham is a Product Designer at HEROP with a passion for collaborating with 
                        diverse teams to achieve design goals. Prior to his role at the lab, he was 
                        improving accessibility in education ...`,
        link: "",
      },
      ,
      {
        name: "Adam Cox",
        title: "DevOps Engineer",
        image: "../../images/e08c6e557dd2e8598a790a7f780a97d4.png",
        text: `Adam is a geospatial developer with a background in GIS and archaeology, 
                        and a passion for open source software. Originally from southwestern Wisconsin, 
                        he lives in New Orleans ...`,
        link: "",
      },
      {
        name: "Mukesh Chugani",
        title: "Software Engineer",
        image: "../../images/e923095a6e1793cdf59ea54945aff489.png",
        text: `Mukesh received his Master of Computer Science from the University of Illinois 
                        Urbana-Champaign and his Bachelor of Technology in Computer Science from Amrita 
                        University. His expertise lies ...`,
        link: "",
      },
      {
        name: "Marc Astacio-Palmer",
        title: "Research Coordinator",
        image: "../../images/436ed95f8fde439f963ef26d08af8526.png",
        text: `Marc received his Master of Science in Experimental Psychology from Nova Southeastern 
                        University. His previous work was in the area of cognitive psychology, specifically, 
                        on attention ...`,
        link: "",
      },
      {
        name: "Andre Vines",
        title: "Graphic Designer",
        image: "../../images/0284b52e965116e499f6bab5e087907b.png",
        text: `Andre is a self employed branding designer and artist from Maryland who had a deep interest 
                        in the field as early as middle school. He is passionate about creating designs that are visually ...`,
        link: "",
      },
      {
        name: "Ashwin Patil",
        title: "Research Assistant",
        image: "../../images/1f625887c8b13064dc458153f16295ca.png",
        text: `Ashwin is a Computer Science graduate student at the University of Illinois at Urbana-Champaign, 
                        graduating in Dec’23. Currently, he am working as a Graduate Research ...`,
        link: "",
      },
    ],
  };

  return (
    <>
      <NavBar />
      <TopLines />
      <div className="flex flex-col">
        <div className="self-center font-nunito flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka" style={{ fontSize: "5rem" }}>
            About
          </h1>
          <div className="self-center w-full -ml-5 mt-20 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-2xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  {data.about}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-[2.5%] relative mt-[-13%] self-center">
          <Image priority src={sdohGraphic} alt="The SDOH & Place graphic" />
        </div>
        <div className="font-nunito self-center z-[1] flex w-full max-w-[1068px] flex-col mt-[200px] mb-[400px] px-5 max-md:max-w-full max-md:mt-10">
          <div className="text-stone-900 text-2xl font-bold max-md:ml-2.5">
            Core Team
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
          <div className="bg-amber-100 self-stretch flex w-full flex-col px-5 pb-[100px] max-md:max-w-full">
            <div
              className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
              style={{ marginTop: "-110px" }}
            >
              <div className="self-center w-full max-md:max-w-full">
                <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                  {data["team"].map((item, index) => (
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
                            className="aspect-[0.98] object-cover rounded-full object-center w-full overflow-hidden grow max-md:mt-10 border-4 border-solid border-lightsalmon shadow-[2px_4px_0px_0px_darkorchid]"
                          />
                        </div>
                        <div className="flex grow flex-col font-nunito max-md:mt-10">
                          <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                            {item.name}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                            {item.title}
                          </div>
                          <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-6">
                            {item.text}
                          </div>
                          <a
                            href={item.link}
                            className="text-purple-700 text-xs font-bold tracking-wide uppercase mt-9"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="font-nunito text-stone-900 py-[50px] text-2xl leading-[133.333%] self-center ml-0 w-[1068px] max-w-[1068px] my-20 max-md:max-w-full max-md:mt-10">
          Spring 2023 research assistants supporting Place metadata
          harmonization and other activites included Elaina Katz, Sarthak Joshi,
          Augustyn Crane, and Jorge Corral.
        </div>
        <Footer />
      </div>
    </>
  );
}

export default About;
