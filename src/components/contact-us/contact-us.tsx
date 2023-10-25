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
import line1 from "../../../public/logos/line1.svg";
import line2 from "../../../public/logos/line2.svg";
import line3 from "../../../public/logos/line3.svg";

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
      </div>
      <div className="w-full min-h-[33rem]">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1068px] mx-auto py-[5rem]">
          <h1 className="text-almostblack pt-[5rem] font-fredoka text-2xl-rfs font-normal leading-8 ml mb-5">
            Contact Us
          </h1>
          <div className="grid grid-flow-col font-nunito justify-start max-md:grid-flow-row max-md:grid-cols-2 gap-y-8 gap-x-4 max-md:justify-items-center max-md:items-start">
            <p>Please connect with us!</p>
          </div>
          <div className="grid grid-flow-col font-nunito justify-start items-center max-md:grid-flow-row max-md:grid-cols-2 gap-y-8 gap-x-4 max-md:justify-items-center max-md:items-start">
            <Image
              priority
              src={emailIcon}
              height={20}
              alt="The SDOH & Place project logo"
            />
            <Link
              href="mailto:mkolak@illinois.edu"
              title="The SDOH & Place project logo"
              style={{
                fontSize: "1.2em",
                color: `${fullConfig.theme.colors["darkorchid"]}`,
              }}
            >
              mkolak@illinois.edu
            </Link>
          </div>
          <div className="flex">
            <Link className="mr-10" href="https://github.com/healthyregions">
              <Image
                priority
                src={githubIcon}
                height={36}
                alt="The SDOH & Place project logo"
              />
            </Link>
            <Link className="mr-10" href="https://github.com/healthyregions">
              <Image
                priority
                src={linkedinIcon}
                height={36}
                alt="The SDOH & Place project logo"
              />
            </Link>
            <Link className="mr-10" href="https://github.com/healthyregions">
              <Image
                priority
                src={facebookIcon}
                height={36}
                alt="The SDOH & Place project logo"
              />
            </Link>
            <Link className="mr-10" href="https://github.com/healthyregions">
              <Image
                priority
                src={xIcon}
                height={36}
                alt="The SDOH & Place project logo"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[33rem] bg-lightbisque">
        <div className="max-md:max-w-[87%] 2xl:max-w-[1068px] mx-auto py-[5rem]">
          <div className="text-almostblack pt-[5rem] font-nunito text-2xl-rfs font-normal leading-8 ml mb-5">
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
