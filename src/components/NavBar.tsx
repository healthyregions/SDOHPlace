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
        setNavBackgroundColor("lightsalmon");
      } else {
        setNavBackgroundColor("transparent");
      }
    };

    window.addEventListener("scroll", changeBackgroundColor);
  }, []);

  const router = useRouter();

  return (
    <div
      className={`absolute font-nunito left-0 top-0 w-full z-50 ease-in duration-300 bg-${navBackgroundColor}`}
    >
      <div
        className={`flex ${
          nav ? "justify-end" : "justify-between"
        } items-center 2xl:max-w-[1536px] pt-8 pb-12 pl-0 pr-0 mx-auto`}
      >
        <ul className="hidden min-[768px]:flex pl-[2.5%]">
          <li
            className={`${
              router.pathname == "/"
                ? "text-darkorchid before:content-[''] before:border-l-[0.25rem] before:border-darkorchid before:pr-[0.5rem]"
                : "text-almostblack"
            } p-4 pl-0 uppercase font-nunito text-base font-bold tracking-[0.03125rem] leading-4`}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className={`${
              router.pathname == "/advisory"
                ? "text-darkorchid before:content-[''] before:border-l-[0.25rem] before:border-darkorchid before:pr-[0.5rem]"
                : "text-almostblack"
            } p-4 uppercase font-nunito text-base font-bold tracking-[0.03125rem] leading-4`}
          >
            <Link href="/advisory">Advisory</Link>
          </li>
          <li
            className={`${
              router.pathname == "/news"
                ? "text-darkorchid before:content-[''] before:border-l-[0.25rem] before:border-darkorchid before:pr-[0.5rem]"
                : "text-almostblack"
            } p-4 uppercase font-nunito text-base font-bold tracking-[0.03125rem] leading-4`}
          >
            <Link href="/news">News</Link>
          </li>
          <li
            className={`${
              router.pathname == "/about"
                ? "text-darkorchid before:content-[''] before:border-l-[0.25rem] before:border-darkorchid before:pr-[0.5rem]"
                : "text-almostblack"
            } p-4 uppercase font-nunito text-base font-bold tracking-[0.03125rem] leading-4`}
          >
            <Link href="/about">About</Link>
          </li>
          <li
            className={`${
              router.pathname == "/contact"
                ? "text-darkorchid before:content-[''] before:border-l-[0.25rem] before:border-darkorchid before:pr-[0.5rem]"
                : "text-almostblack"
            } p-4 uppercase font-nunito text-base font-bold tracking-[0.03125rem] leading-4`}
          >
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <div
          onClick={handleNav}
          className="block min-[768px]:hidden pl-[3%] z-50"
        >
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`min-[768px]:hidden absolute ${
            nav ? "left-0" : "left-[-100%]"
          } top-0 bottom-0 right-0 flex justify-center items-center w-full
          h-screen bg-darkorchid text-center ease-in duration-300`}
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
