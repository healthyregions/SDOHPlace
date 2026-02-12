import { GuidesContent } from "@/lib/guides";
import Image from "next/image";
import Link from "next/link";
import {format, formatISO} from "date-fns";
import React from "react";

type Props = {
  item: GuidesContent;
};

const PublishDate = ({ item }: Props) => {
  const publish_date = new Date(item.last_updated);

  var now = new Date();
  now.setHours(0,0,0,0);
  return (
    <small>
      <time dateTime={formatISO(publish_date)}>
        <span>{format(publish_date, "LLLL d, yyyy")}</span>
      </time>
    </small>
  );
}
export default function GuidesItem({ item }: Props) {
  return (
    <Link
      href={"/guides/" + item.slug}
      className="no-underline text-almostblack hover:text-almostblack visited:text-almostblack"
    >
      <div className={'flex max-md:flex-col'}>
        <div style={{ minWidth: '200px' }}>
          <Image src={item.featured_image} alt={item.title} width={200} height={25} />
        </div>
        <div style={{ paddingLeft: "2rem" }}>
          <h2>{item.title}</h2>
          <p>{item.author}</p>
          <PublishDate item={item}></PublishDate>
          {item.description &&
            <div className={'mt-4'}>{item.description}</div>
          }
          <div className={'flex-col self-end mt-4 text-frenchviolet'}>
            <span>Access resource &rarr;</span>
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
