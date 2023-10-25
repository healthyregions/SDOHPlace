import { useState, useEffect } from "react";
import type { NextPage } from "next";
import NavBar from "../homepage/navbar";
import { Button, Icon, colors } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import { withStyles, makeStyles, createStyles } from "@mui/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

import githubIcon from "../../../public/logos/github-purple-icon.svg";
import linkedinIcon from "../../../public/logos/linkedin-purple-icon.svg";
import facebookIcon from "../../../public/logos/facebook-purple-icon.svg";
import xIcon from "../../../public/logos/x-purple-icon.svg";
import emailIcon from "../../../public/logos/email-icon.svg";

import { AiOutlineMail } from "react-icons/ai";

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
      <div className="w-full min-h-[10rem]">
        <div className="container mx-auto">
          <div className="text-almostblack pt-[5rem] font-nunito text-2xl-rfs font-normal leading-8 ml mb-5">
            Contact Us
          </div>
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
        <div className="container mx-auto">
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
    </>
  );
};

export default Contact;
