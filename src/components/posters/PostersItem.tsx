import { getGuideUpdatedDate } from "@/lib/guideDates";
import type { PostersContent } from "@/lib/posters";
import Image from "next/image";
import Link from "next/link";
import {format, formatISO} from "date-fns";
import React from "react";

type Props = {
  item: PostersContent;
};

export default function PostersItem({ item }: Props) {
  return (
    <Link
      href={item.link}
      target={'_blank'}
      className="no-underline text-almostblack hover:text-almostblack visited:text-almostblack"
    >
      <div className={'flex max-md:flex-col'}>
        <div style={{ minWidth: '200px' }}>
          <Image src={item.image} alt={item.title} width={200} height={25} />
        </div>
        <div style={{ paddingLeft: "2rem" }}>
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
