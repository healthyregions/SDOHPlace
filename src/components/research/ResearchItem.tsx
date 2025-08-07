import { ResearchContent } from "@/lib/research";
import Image from "next/image";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import React from "react";
import {Grid} from "@mui/material";
import {format, formatISO} from "date-fns";


type Props = {
  item: ResearchContent;
};

const PublishDate = ({ item }: Props) => {
  const date = new Date(item.publish_date);
  return (
    <small>
      <time dateTime={formatISO(date)}>
        <span>{format(date, "LLLL d, yyyy")}</span>
      </time>
    </small>
  );
}

const AuthorsList = ({ item }: Props) => <>
  <div>{item.author}</div>
</>


export default function ResearchItem({ item }: Props) {
  return (
    <>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Image src={item.image} alt={item.title} width={200} height={25} />
          </Grid>
          <Grid item xs>
            <h2>{item.title}</h2>
            <AuthorsList item={item} />
            <PublishDate item={item} />
            <p className={'mt-4'}>{item.description}</p>
            {
              item.media?.map(url => <a className={'no-underline mt-4'} key={url} href={url}>
                Access resource &rarr;
              </a>)
            }
          </Grid>
        </Grid>
        <style jsx>
          {`
            a {
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-size: 2rem;
            }
          `}
        </style>
    </>
  );
}
