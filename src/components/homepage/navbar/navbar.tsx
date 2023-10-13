import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const NavBar: NextPage = () => {

    const [nav, setNav] = useState(false);
    const [navBackgroundColor, setNavBackgroundColor] = useState('transparent');

    const handleNav = () => {
        setNav(!nav);
    };

    useEffect(
        () => {
            const changeBackgroundColor = () => {
                if (window.scrollY >= 90) {
                    setNavBackgroundColor('lightsalmon');
                }
                else {
                    setNavBackgroundColor('transparent');
                }
            };

            window.addEventListener('scroll', changeBackgroundColor);
        },
        []);

  return (
    <div className={`fixed left-0 top-0 w-full z-10 ease-in duration-300 bg-${navBackgroundColor}`}>
      <div className={`max-w-[1240px] m-auto flex ${nav ? 'justify-end' : 'justify-between'} items-center p-4`}>
        <ul className="hidden sm:flex">
          <li className="p-4 uppercase">
            <Link href="/">Home</Link>
          </li>
          <li className="p-4 uppercase">
            <Link href="/">About</Link>
          </li>
          <li className="p-4 uppercase">
            <Link href="/">Advisory</Link>
          </li>
          <li className="p-4 uppercase">
            <Link href="/">Contact Us</Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <div onClick={handleNav} className="block sm:hidden z-10">
          {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden absolute ${nav ? 'left-0' : 'left-[-100%]'} top-0 bottom-0 right-0 flex justify-center items-center w-full
          h-screen bg-darkorchid text-center ease-in duration-300`}
        >
          <ul>
            <li className="p-4 text-5xl uppercase">
              <Link href="/">Home</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/">About</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/">Advisory</Link>
            </li>
            <li className="p-4 text-5xl uppercase">
              <Link href="/">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
