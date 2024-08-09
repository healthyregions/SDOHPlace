import Image from "next/image";
import { JSX } from "react";

interface Props {
  src: string;
  alt: string;
  rounded: boolean;
}

const ProfileImage = (props: Props): JSX.Element => {
  let className = "object-cover object-center w-full h-full overflow-hidden";
  if (props.rounded) {
    className +=
      " rounded-full border-4 border-solid border-salmonpink shadow-[2px_4px_0px_0px_frenchviolet]";
    return (
      <div style={{ width: 165, height: 165 }}>
        <Image
          loading="lazy"
          src={props.src}
          width={165}
          height={165}
          className={className}
          alt={props.alt}
          style={{ boxShadow: "2px 4px 0px 0px #8120c4" }}
        />
      </div>
    );
  } else {
    return (
      <Image
        loading="lazy"
        src={props.src}
        width="0"
        height="0"
        className={className}
        alt={props.alt}
      />
    );
  }
};

export default ProfileImage;
