import * as React from "react";
import Image from "next/image";
import line15 from "@/public/logos/line15.svg";
import line16 from "@/public/logos/line16.svg";

export default function SearchTopLines() {
  return (
    <div className="w-full h-screen max-md:h-auto max-md:min-h-[60rem] -z-50 absolute">
      <div className="absolute left-[70%] top-0 w-[13vw] max-md:w-[22vw] max-md:left-[28%] h-auto">
        <Image priority src={line16} alt="" className="w-full h-full" />
      </div>
      <div className="absolute right-0 w-[5vw] max-md:w-[5vw] h-auto top-[0.5em] max-md:top-[0.5em]">
        <Image priority src={line15} alt="" className="w-full h-full" />
      </div>
      {/* <div className="absolute right-0 top-[43%] w-[5vw] max-md:hidden h-auto">
        <Image priority src={line3} alt="" className="w-full h-full" />
      </div> */}
    </div>
  );
}
