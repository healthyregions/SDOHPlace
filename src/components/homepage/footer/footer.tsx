import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { makeStyles, withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import ButtonWithIcon from "@/components/homepage/buttonwithicon";

import footerLine1 from "@/public/logos/footer-line1.svg";
import footerLine2 from "@/public/logos/footer-line2.svg";
import footerLine3 from "@/public/logos/footer-line3.svg";
import footerLine4 from "@/public/logos/footer-line4.svg";
import footerLine5 from "@/public/logos/footer-line5.svg";
import footerLine6 from "@/public/logos/footer-line6.svg";
import mobileFooterLine1 from "@/public/logos/mobile-footer-line1.svg";
import mobileFooterLine2 from "@/public/logos/mobile-footer-line2.svg";
import mobileFooterLine3 from "@/public/logos/mobile-footer-line3.svg";
import mobileFooterLine4 from "@/public/logos/mobile-footer-line4.svg";
import mobileFooterLine5 from "@/public/logos/mobile-footer-line5.svg";
import theSDOHPlaceProjectFooter from "@/public/logos/the-sdoh-place-project-footer.svg";
import githubIcon from "@/public/logos/github-purple-icon.svg";
import linkedinIcon from "@/public/logos/linkedin-purple-icon.svg";
import facebookIcon from "@/public/logos/facebook-purple-icon.svg";
import xIcon from "@/public/logos/x-purple-icon.svg";
import newsIcon from "@/public/logos/news.svg";
import emailIcon from "@/public/logos/email-icon.svg";
import chevronRight from "@/public/logos/chevron-right.svg";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import {ChevronRight, Feed, MailOutline} from "@mui/icons-material";

const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  marginAutoDesktop: {
    "@media (min-width: 960px)": {
      margin: "0 auto",
    },
  },
  marginAutoDesktopAhead: {
    "@media (min-width: 960px)": {
      margin: "-10rem auto 0 auto",
    },
  },
}));
const Footer = (): JSX.Element => {
  const classes = useStyles();
  const CssTextField = withStyles({
    root: {
      "& label.Mui-focused": {
        color: `${fullConfig.theme.colors["frenchviolet"]}`,
      },
      "& label": {
        color: `${fullConfig.theme.colors["lightgray"]}`,
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: `${fullConfig.theme.colors["frenchviolet"]}`,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: `${fullConfig.theme.colors["lightgray"]}`,
        },
        "&.Mui-focused input": {
          "--tw-ring-color": "none",
          outline: "none",
        },
        "&:hover fieldset": {
          borderColor: `${fullConfig.theme.colors["lightgray"]}`,
        },
        "&.Mui-focused fieldset": {
          borderColor: `${fullConfig.theme.colors["frenchviolet"]}`,
          outline: "none",
        },
      },
      "& input": {
        color: `${fullConfig.theme.colors["lightgray"]}`,
      },
    },
  })(TextField);

  return (
    <>
      <div className="w-full min-h-[33.625rem] max-md:min-h-[62rem] bg-almostblack z-10">
        <div className="w-full min-h-[33.625rem] max-md:min-h-[62rem] px-[2.5%] z-20 absolute">
          <div className="absolute left-[63%] top-[-3.5%] w-[7.5vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine1}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute left-[79%] top-[-3%] w-[7vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine2}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-0 top-[43%] w-[6vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine3}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-0 bottom-0 w-[6vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine4}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute left-[82%] bottom-0 w-[4vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine5}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute left-[63%] bottom-0 w-[1.75vw] max-md:hidden h-auto">
            <Image
              priority
              src={footerLine6}
              alt=""
              className="w-full h-full"
            />
          </div>

          {/* Mobile footer lines */}
          <div className="absolute right-0 bottom-[32%] w-[18vw] md:hidden h-auto">
            <Image
              priority
              src={mobileFooterLine1}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-0 bottom-[22%] w-[12vw] md:hidden h-auto">
            <Image
              priority
              src={mobileFooterLine2}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-0 bottom-0 w-[25vw] md:hidden h-auto">
            <Image
              priority
              src={mobileFooterLine3}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-[30%] bottom-0 w-[11vw] md:hidden h-auto">
            <Image
              priority
              src={mobileFooterLine4}
              alt=""
              className="w-full h-full"
            />
          </div>
          <div className="absolute right-[60%] bottom-0 w-[5vw] md:hidden h-auto">
            <Image
              priority
              src={mobileFooterLine5}
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="max-md:max-w-[66.66%] mx-auto pt-[5rem] pb-[1rem] 2xl:max-w-[1536px] flex md:flex-row max-md:flex-col gap-y-16 px-[2.5%] z-30 relative">
          <div className="flex flex-col justify-center gap-[1.56rem] flex-[33.33]">
            <div className="flex flex-row">
              <div className="py-4 relative mt-[-3%]">
                <Image
                  priority
                  src={theSDOHPlaceProjectFooter}
                  alt="The SDOH & Place Project logo"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-md:max-w-[66.66%] mx-auto pt-[0] pb-[4.5rem] 2xl:max-w-[1536px] flex md:flex-row max-md:flex-col gap-y-16 px-[2.5%] z-30 relative">
          <div className="flex flex-col justify-center gap-[1.56rem] flex-[33.33]">
            <div className="max-w-[21.5625rem] text-white text-xl-rfs leading-6 tracking-[0.03125rem]">
              The SDOH & Place Project&apos;s mission is to unravel the
              application design process essential for developing web
              applications centered on neighborhood health.
            </div>

            <div className="h-[0.0625rem] bg-[#3F3D56] max-w-[21.5625rem]"></div>

            <div className="flex flex-row gap-5">
              <a
                href="https://github.com/healthyregions/SDOHPlace"
                title="View code on GitHub"
                rel="noreferrer"
                target="_blank"
              >
                <Image priority src={githubIcon} alt="View code on GitHub" />
              </a>
              <a
                href="https://www.linkedin.com/groups/12857797/"
                title="Follow us on LinkedIn"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  priority
                  src={linkedinIcon}
                  alt="Follow us on LinkedIn"
                />
              </a>
              <a
                href="https://www.facebook.com/HealthyRegions"
                title="HealthyRegions on Facebook"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  priority
                  src={facebookIcon}
                  alt="HealthyRegions on Facebook"
                />
              </a>
              <a
                href="https://x.com/healthyregions"
                title="@healthyregions on X"
                rel="noreferrer"
                target="_blank"
              >
                <Image priority src={xIcon} alt="@healthyregions on X" />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-[1.56rem] flex-[33.33]">
            <ul
              className={`${classes.marginAutoDesktop} flex flex-col justify-center gap-5 items-start`}
            >
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/advisory"
                >
                  Advisory
                </Link>
              </li>
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/fellows"
                >
                  Fellows
                </Link>
              </li>
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/news"
                >
                  News
                </Link>
              </li>
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/project"
                >
                  About
                </Link>
              </li>
              <li className="leading-4">
                <Link
                  className="uppercase no-underline text-salmonpink text-center text-xl-rfs"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={`${classes.marginAutoDesktopAhead} flex flex-row justify-center flex-[33.33]`}
          >
            <div
              className={`flex flex-col gap-[.5rem] justify-center max-w-[21.5625rem] `}
            >
              <h3 className="text-white">Stay updated</h3>
              <h5 className="text-gray-500">For all the latest and greatest</h5>
              <ButtonWithIcon
                label={"NEWS"}
                svgIcon={<Feed />}
                endIcon={<ChevronRight />}
                borderRadius={"1rem"}
                width={"100%"}
                justifyContent="space-between"
                fillColor={"smokegray"}
                labelColor={"salmonpink"}
                onClick={() => {
                  window.location.href = "/news";
                }}
              ></ButtonWithIcon>
              <ButtonWithIcon
                label={"NEWSLETTER"}
                svgIcon={<MailOutline />}
                endIcon={<ChevronRight />}
                borderRadius={"1rem"}
                width={"100%"}
                justifyContent="space-between"
                fillColor={"smokegray"}
                labelColor={"salmonpink"}
                onClick={() => {
                  // Link to sign up to the Mailing List
                  window.open("https://groups.webservices.illinois.edu/subscribe/192463", "_blank");
                }}
              ></ButtonWithIcon>
            </div>
          </div>
          {/*
          <div className="flex flex-col justify-center flex-[34.86] items-start">
            <div className=" text-white text-2xl-rfs leading-8 tracking-[0.03125rem]">
              Sign up for our newsletter!
            </div>
            <div className=" text-salmonpink text-xl-rfs leading-6 tracking-[0.03125rem]">
              For all the latest and greatest
            </div>
            <div className="relative mt-[1.25rem]">
              <CssTextField
                label="Email"
                variant="outlined"
                id="custom-css-outlined-input"
                type="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                      ></IconButton>
                      <Image priority src={sendIcon} alt="Subscribe" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          */}
        </div>
      </div>
    </>
  );
};

export default Footer;
