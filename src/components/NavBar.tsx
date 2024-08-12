import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles((theme) => ({
  mobileHamburgerMenu: {
    fontSize: "1.5rem",
  },
}));

type NavLinkType = {
  title: string;
  url: string;
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
        className={`nav-button p-0 font-light${
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
            <Link href={item.url}>{item.title}</Link>
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

  const fellowItems = [{ title: "Showcase", url: "/showcase" }];

  const aboutItems = [
    { title: "Advisory", url: "/advisory" },
    { title: "SDOH & Place Project", url: "/about" },
  ];

  return (
    <div
      className={`absolute left-0 top-0 w-full z-50 ease-in duration-300 bg-${navBackgroundColor}`}
    >
      <div
        className={`flex justify-between items-center 2xl:max-w-[1536px] pt-8 pb-12 pl-0 pr-0 mx-auto`}
      >
        <ul className="navbar hidden min-[768px]:flex pl-[2.5%]">
          <li className={`${router.pathname == "/" ? "active" : ""}`}>
            <Link href="/">Home</Link>
          </li>
          <li
            className={`${
              router.pathname == "/fellows" ||
              router.pathname.startsWith("/showcase")
                ? "active"
                : ""
            }`}
          >
            <NavDropdownButton
              title="Fellows"
              dropdownElId="fellows-dd"
              items={fellowItems}
              directLink="/fellows"
            />
          </li>
          <li
            className={`${router.pathname.startsWith("/news") ? "active" : ""}`}
          >
            <Link href="/news">News</Link>
          </li>
          <li
            className={`${
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
          <li
            className={`${
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
            <AiOutlineClose size={35} color={"white"} />
          ) : (
            <AiOutlineMenu size={35} />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`min-[768px]:hidden absolute ${
            nav ? "left-0" : "left-[-100%]"
          } top-0 bottom-0 right-0 pt-100 flex justify-center items-baseline w-full
          h-screen bg-frenchviolet text-center ease-in duration-300 `}
        >
          <ul className="navbar-mobile">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/fellows">Fellows</Link>
            </li>
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <NavDropdownMobile
                title="About"
                dropdownElId="about-dd-mobile"
                items={aboutItems}
              />
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
