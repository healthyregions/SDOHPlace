import type { PostersContent } from "@/lib/posters";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {useMediaQuery} from "@mui/material";

type Props = {
  item: PostersContent;
};

export default function PostersItem({ item }: Props) {
  const largeScreen = useMediaQuery('(min-width: 600px)');
  return (
    <Link
      href={item.link}
      target={'_blank'}
      className="no-underline text-almostblack hover:text-almostblack visited:text-almostblack"
    >
      <div className={'flex max-md:flex-col'}>
        <div style={{ minWidth: largeScreen ? '200px' : '300px'}}>
          <Image src={item.image} alt={item.title} width={largeScreen ? 200 : 300} height={25} />
        </div>
        <div style={{ paddingLeft: largeScreen ? "2rem" : 0 }}>
          <h2>{item.title}</h2>
          <p>{item.author}</p>
          <small>{item.institution}</small>
          <div className={'flex-col self-end mt-4 text-frenchviolet'}>
            <span>View Poster &rarr;</span>
          </div>
        </div>
      </div>
      <style jsx>
        {`
            h2 {
              margin: 0;
              font-size: 2rem;
            }
          `}
      </style>
    </Link>
  );
}
