"use client";
import type { NextPage } from "next";
import Footer from "@/components/homepage/footer";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { AiOutlineClose } from "react-icons/ai";

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
  color: "white",
  bgcolor: "#1e1e1e",
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
  color: `${fullConfig.theme.colors["darkorchid"]}`,
  textTransform: "uppercase",
};

const Advisory: NextPage = () => {
  const stakeholderList = [];
  const technicalList = [];
  Object.keys(people).map(function (id, keyIndex) {
    const item = people[id];
    item.id = id;
    if (item.category.indexOf("stakeholder") >= 0) {
      stakeholderList.push(item);
    } else if (item.category.indexOf("technical") >= 0) {
      technicalList.push(item);
    }
  });
  const [open, setOpen] = React.useState(false);
  const [bio, setBio] = React.useState("german");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Header title={"Advisory"} />
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
          <h1 className="font-fredoka">Advisory</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-2xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  The Place Project has an advisory board consisting of experts
                  from public, private, and academic sectors. Their primary
                  responsibility is to provide methodological guidance, offer
                  critical and technical insights, and ensure that the Place
                  project aligns with the requirements of communities in the
                  United States that are disproportionately affected by health,
                  spatial, and racial disparities.
                  <br />
                  <br />
                  The members of the Place Project advisory board combine vast
                  experience in designing complex engineering and scientific
                  solutions for both non-profit and academic settings, as well
                  as a proven track record in conducting community-based
                  research and outreach programs with minority and segregated
                  communities.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col mt-10 max-md:max-w-full max-md:mr-0.5 max-md:mt-10">
          <div className="self-center text-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] p-[25px] ml-18 max-md:ml-2.5">
            <h2 className="font-fredoka">Stakeholder Team</h2>
          </div>
          <div className="bg-lightbisque self-stretch flex grow flex-col px-5 max-md:max-w-full">
            <div className="self-center flex w-full max-w-[1246px] flex-col max-md:max-w-full">
              <div
                className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
                style={{ marginTop: "-110px" }}
              >
                <div className="self-center w-full max-md:max-w-full">
                  <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                    {stakeholderList.map((item, index) => (
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
                              alt={item.name}
                            />
                          </div>
                          <div className="flex grow flex-col max-md:mt-10">
                            <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                              {item.name}
                            </div>
                            <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                              {item.affiliation}
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
        </div>
        <div className="self-stretch flex flex-col mt-10 max-md:max-w-full max-md:mr-0.5 max-md:mt-10">
          <div className="self-center text-center w-full max-md:max-w-full mb-32 text-stone-900 max-w-[1246px] p-[25px] ml-18 max-md:ml-2.5">
            <h2 className="font-fredoka">Technical Team</h2>
          </div>
        </div>
        <div className="bg-lightbisque self-stretch flex mt-0 w-full flex-col px-5 max-md:max-w-full">
          <div
            className="self-center flex w-full max-w-[1246px] flex-col mt-0.5 max-md:max-w-full"
            style={{ marginTop: "-110px" }}
          >
            <div className="self-center w-full max-md:max-w-full">
              <div className="flex flex-wrap max-md:flex-col max-md:items-stretch max-md:gap-0">
                {technicalList.map((item, index) => (
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
                          alt={item.name}
                        />
                      </div>
                      <div className="flex grow flex-col max-md:mt-10">
                        <div className="text-stone-900 text-2xl font-bold leading-[133.333%]">
                          {item.name}
                        </div>
                        <div className="text-stone-900 text-lg font-medium leading-[177.778%] mt-1">
                          {item.affiliation}
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
        <Footer />
      </div>
    </>
  );
};

export default Advisory;
