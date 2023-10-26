import { useState, useEffect } from "react";
import type { NextPage } from "next";
import NavBar from "../homepage/navbar";
import Footer from "../homepage/footer";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";

import githubIcon from "../../../public/logos/github-purple-icon.svg";
import linkedinIcon from "../../../public/logos/linkedin-purple-icon.svg";
import facebookIcon from "../../../public/logos/facebook-purple-icon.svg";
import xIcon from "../../../public/logos/x-purple-icon.svg";
import emailIcon from "../../../public/logos/email-icon.svg";

import TopLines from "../TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

import styles from "../homepage/homepage.module.css";

const Contact: NextPage = () => {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (window.location.search.includes("success=true")) {
      setSuccess(true);
    }
  }, []);
  const CssTextField = withStyles({
    root: {
      "& label.Mui-focused": {
        color: "#49454F",
        fontFamily: "nunito",
      },
      "& label": {
        color: "#49454F",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#79747E",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#CAC4D0",
        },
        "&.Mui-focused input": {
          "--tw-ring-color": "#79747E",
          outline: "none",
        },
        "&:hover fieldset": {
          borderColor: "#CAC4D0",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#79747E",
          outline: "none",
        },
      },
      "& input": {
        color: `${fullConfig.theme.colors["almostblack"]}`,
        fontFamily: "nunito",
        outline: "none",
      },
      "& textarea": {
        color: `${fullConfig.theme.colors["almostblack"]}`,
        fontFamily: "nunito",
        outline: "none",
      },
    },
  })(TextField);
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
                  <p>Please connect with us!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mb-10 mt-10">
            <Link
              className="mr-10"
              href="https://github.com/healthyregions"
              title="@heathyregions on GitHub"
            >
              <Image
                priority
                src={githubIcon}
                height={36}
                alt="@heathyregions on GitHub"
              />
            </Link>
            <Link
              className="mr-10"
              href="https://www.linkedin.com/groups/12857797/"
              title="Follow us on LinkedIn"
            >
              <Image
                priority
                src={linkedinIcon}
                height={36}
                alt="Follow us on LinkedIn"
              />
            </Link>
            <Link
              className="mr-10"
              href="https://www.facebook.com/HealthyRegions"
              title="HealthyRegions on Facebook"
            >
              <Image
                priority
                src={facebookIcon}
                height={36}
                alt="HealthyRegions on Facebook"
              />
            </Link>
            <Link
              className="mr-10"
              href="https://x.com/healthyregions"
              title="@healthyregions on X"
            >
              <Image
                priority
                src={xIcon}
                height={36}
                alt="@healthyregions on X"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[20rem] bg-lightbisque">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1068px] mx-auto py-[5rem]">
          <div className="text-almostblack font-nunito text-2xl-rfs font-normal leading-8 ml mb-5">
            Send us a Message
          </div>
          <div className="">
            {(success && (
              <p className="text-almostblack pt-[1rem] font-nunito">
                Message received. Thank you!
              </p>
            )) || (
              <form
                className="w-full"
                name="contact"
                method="POST"
                data-netlify="true"
                action="/contact-us/?success=true"
              >
                <input type="hidden" name="form-name" value="contact" />
                <div className="flex justify-start mb-5">
                  <CssTextField
                    label="Name"
                    name="name"
                    focused
                    sx={{
                      marginRight: "20px",
                    }}
                  />
                  <CssTextField label="Email" name="email" focused />
                </div>
                <div className="w-full mb-5">
                  <CssTextField
                    id="outlined-multiline-flexible"
                    label="Message"
                    name="message"
                    minRows={4}
                    focused
                    multiline
                    sx={{
                      width: "100%",
                    }}
                  />
                </div>
                <div className="mb-5">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      height: "2.5rem",
                      width: "6em",
                      borderRadius: "6.25rem",
                      background: `${fullConfig.theme.colors["darkorchid"]}`,
                      textTransform: "none",
                      color: `${fullConfig.theme.colors["white"]}`,
                      fontFamily: "nunito",
                      fontSize: "clamp(1.125rem, 1vw + 0.5rem, 1.25rem)",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "1.5rem",
                      letterSpacing: "0.00938rem",
                      marginRight: "20px",
                    }}
                  >
                    Send
                  </Button>
                  {/* <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{
                      height: "2.5rem",
                      borderRadius: "6.25rem",
                      borderColor: `${fullConfig.theme.colors["darkorchid"]}`,
                      background: 'none',
                      textTransform: "none",
                      color: `${fullConfig.theme.colors["darkorchid"]}`,
                      fontFamily: "nunito",
                      fontSize: "clamp(1.125rem, 1vw + 0.5rem, 1.25rem)",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "1.5rem",
                      letterSpacing: "0.00938rem",
                    }}
                  >Clear</Button> */}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
