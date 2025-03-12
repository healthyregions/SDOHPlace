import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Fade} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  mobileHamburgerMenu: {
    fontSize: "1.5rem",
  },
}));

type NavLinkType = {
  title: string;
  url: string;
  target?: string;
};
type Props = {
  title: string;
  dropdownElId: string;
  items: NavLinkType[];
  directLink?: string;
};
function NavDropdownButton({ title, dropdownElId, items, directLink }: Props) {
  return (
    <>
      <button
        className={`nav-button p-0 pb-2 font-light${
          directLink ? "" : " cursor-default"
        }`}

        onMouseLeave={() => {
          document.getElementById(dropdownElId).setAttribute("hidden", "");
        }}
        onMouseEnter={() => {
          document.getElementById(dropdownElId).removeAttribute("hidden");
        }}
        onClick={() => {
          if (directLink) window.location.href = directLink;
        }}
      >
        {title} <ExpandMoreIcon />
      </button>
      <ul
        id={dropdownElId}
        style={{ boxShadow: '#aaaaaa 6px 12px 16px -8px' }}
        onMouseEnter={() => {
          document.getElementById(dropdownElId).removeAttribute("hidden");
        }}
        onMouseLeave={() => {
          document.getElementById(dropdownElId).setAttribute("hidden", "");
        }}
        hidden
      >
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.url} target={item.target || ''}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function NavDropdownMobile({ title, dropdownElId, items }: Props) {
  return (
    <>
      <button
        onClick={() => {
          document.getElementById(dropdownElId).toggleAttribute("hidden");
        }}
      >
        {title} <ExpandMoreIcon />
      </button>
      <ul id={dropdownElId} hidden>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              className={"text-white no-underline text-base"}
              href={item.url}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

const NavBar = (): JSX.Element => {
  const [nav, setNav] = useState(false);
  const [navBackgroundColor, setNavBackgroundColor] = useState("transparent");

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const changeBackgroundColor = () => {
      if (window.scrollY >= 90) {
        setNavBackgroundColor("salmonpink");
      } else {
        setNavBackgroundColor("transparent");
      }
    };
    window.addEventListener("scroll", changeBackgroundColor);
  }, []);

  const router = useRouter();
  const classes = useStyles();

  const aboutItems = [
    { title: "Project", url: "/about" },
    { title: "Core Team", url: "/team" },
    { title: "Advisory", url: "/advisory" },
  ];

  const resourcesItems = [
    //{ title: "Data Discovery", url: "/search" },
    { title: "Community Toolkit", url: "https://toolkit.sdohplace.org", target: '_blank' },
    //{ title: "SDOH Guides", url: "/guides" },
  ];

  const communityItems = [
    { title: "Fellows", url: "/fellows" },
    { title: "Showcase", url: "/showcase" },
    //{ title: "Place Mini-Projects", url: "/mini-projects" },
    { title: "Things We Like!", url: "/recommendations" },
  ];

  return (
    <div
      className={`absolute left-0 top-0 w-full z-50 ease-in duration-300 bg-${navBackgroundColor}`}
    >
      <div
        className={`flex justify-between items-center 2xl:max-w-[1536px] pt-8 pb-12 pl-0 pr-0 mx-auto`}
      >
        <ul className="navbar hidden min-[768px]:flex pl-[2.5%]">
          { router.pathname != "/" && <li className={'p-0 pt-2 mr-6'}>
              <Link href="/" style={{ padding:0, margin:0 }}>
                <Image width={40} height={40} src={'/logos/sdoh-logo-navbar-desktop.svg'} alt={'LOGO'} />
              </Link>
            </li>
          }

          {/* Home Link */}
          <li className={`mt-4 ${router.pathname == "/" ? "active" : ""}`}>
            <Link href="/">Home</Link>
          </li>

          {/* Resources Menu */}
          <li
            className={`mt-4 ml-6 ${
              router.pathname == "/search"
                ? "active"
                : ""
            }`}
          >
            <NavDropdownButton
              title="Resources"
              dropdownElId="resources-dd"
              items={resourcesItems}
            />
          </li>

          {/* Community Menu */}
          <li
            className={`mt-4 ml-6 ${
              router.pathname == "/fellows" ||
              router.pathname.startsWith("/showcase")
                ? "active"
                : ""
            }`}
          >
            <NavDropdownButton
              title="Community"
              dropdownElId="fellows-dd"
              items={communityItems}
            />
          </li>

          {/* News Link */}
          <li
            className={`mt-4 ml-6 ${router.pathname.startsWith("/news") ? "active" : ""}`}
          >
            <Link href="/news">News</Link>
          </li>

          {/* About Menu */}
          <li
            className={`mt-4 ml-4 ${
              router.pathname.startsWith("/about") ||
              router.pathname.startsWith("/advisory")
                ? "active"
                : ""
            }`}
          >
            <NavDropdownButton
              title="About"
              dropdownElId="about-dd"
              items={aboutItems}
            />
          </li>

          {/* Contact Us Link */}
          <li
            className={`mt-4 ml-4 ${
              router.pathname.startsWith("/contact") ? "active" : ""
            }`}
          >
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <div
          onClick={handleNav}
          className="block min-[768px]:hidden pl-[25px] z-50"
        >
          {nav ? (
              <AiOutlineClose size={35} color={"white"} className={'animate-fade-in'} />
          ) : (
              <AiOutlineMenu size={35} className={'animate-fade-in'} />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`min-[768px]:hidden absolute ${
            nav ? "left-0" : "left-[-100%]"
          } top-0 bottom-0 right-0 pt-100 flex justify-center items-baseline w-full
          h-screen bg-frenchviolet ease-in duration-300 `}
        >
          <ul className="navbar-mobile">
            <li>
              <Link href="/">
                <Image width={150} height={75} src={'./logos/sdoh-logo-navbar-mobile.svg'} alt={'LOGO'} />
              </Link>
            </li>

            {/* Home Link */}
            <li className={'text-uppercase'}>
              <Link href="/">Home</Link>
            </li>

            {/* Resources Menu */}
            <li>
              <Link href="/">Home</Link>
            </li>

            {/* Community Menu */}
            <li>
              <NavDropdownMobile
                title="Community"
                dropdownElId="fellows-dd-mobile"
                items={communityItems}
              />
            </li>

            {/* News Link */}
            <li className={'text-uppercase'}>
              <Link href="/news">News</Link>
            </li>

            {/* About Menu */}
            <li>
              <NavDropdownMobile
                title="About"
                dropdownElId="about-dd-mobile"
                items={aboutItems}
              />
            </li>

            {/* Contact Us Link */}
            <li className={'text-uppercase'}>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
