import { ResearchContent } from "@/lib/research";
import Image from "next/image";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import React from "react";
import {Grid} from "@mui/material";

type Props = {
  item: ResearchContent;
};
export default function ResearchItem({ item }: Props) {
  return (
    <Link href={"/research/" + item.slug} legacyBehavior>
      <a className={"no-underline"}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Image src={item.image} alt={item.title} width={200} height={25} />
          </Grid>
          <Grid item xs>
            <h2>{item.title}</h2>
            <small>{item.publish_date}</small>
            <p>{item.description}</p>
          </Grid>
        </Grid>
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
