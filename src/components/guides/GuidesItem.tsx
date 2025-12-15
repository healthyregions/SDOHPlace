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
    <Link href={"/guides/" + item.slug} legacyBehavior>
      <a className={"no-underline"}>
        <div style={{ display: "flex" }}>
          <div>
            <Image src={item.featured_image} alt={item.title} width={200} height={25} />
          </div>
          <div style={{ paddingLeft: "2rem" }}>
            <h2>{item.title}</h2>
            <p>{item.author}</p>
            <PublishDate item={item}></PublishDate>
          </div>
        </div>
        <style jsx>
          {`
            a {
              color: #222;
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-size: 2rem;
            }
          `}
        </style>
      </a>
    </Link>
  );
}
