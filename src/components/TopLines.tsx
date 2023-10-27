import Image from "next/image";
import line1 from "@/public/logos/line1.svg";
import line2 from "@/public/logos/line2.svg";
import line3 from "@/public/logos/line3.svg";

export default function TopLines() {
  return (
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
  );
}
