import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";

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

  return (
    <div
      className={`absolute left-0 top-0 w-full z-50 ease-in duration-300 bg-${navBackgroundColor}`}
    >
      <div
        className={`flex justify-between items-center 2xl:max-w-[1536px] mt-8 pl-0 pr-0 mx-auto`}
      >
        <ul className="hidden min-[768px]:flex pl-[2.5%]">
          <li
            className={`navbar-title ${
              router.pathname == "/" && "navbar-title-active"
            }`}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className={`navbar-title ${
              router.pathname == "/advisory" && "navbar-title-active"
            }`}
          >
            <Link href="/advisory">Advisory</Link>
          </li>
          <li
            className={`navbar-title ${
              router.pathname.startsWith("/news") && "navbar-title-active"
            }`}
          >
            <Link href="/news">News</Link>
          </li>
          <li
            className={`navbar-title ${
              router.pathname == "/about" && "navbar-title-active"
            }`}
          >
            <Link href="/about">About</Link>
          </li>
          <li
            className={`navbar-title ${
              router.pathname == "/contact" && "navbar-title-active"
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
          {nav ? <AiOutlineClose size={35} /> : <AiOutlineMenu size={35} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`min-[768px]:hidden absolute ${
            nav ? "left-0" : "left-[-100%]"
          } top-0 bottom-0 right-0 flex justify-center items-center w-full
          h-screen bg-frenchviolet text-center ease-in duration-300`}
        >
          <ul>
            <li className="p-4 text-5xl uppercase">
              <Link href="/">Home</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/advisory">Advisory</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/news">News</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/about">About</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
