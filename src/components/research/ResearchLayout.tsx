import React from "react";
import styles from "@/public/styles/posts.module.css";
import Author from "../news/Author";
import Copyright from "../news/Copyright";
import DateComponent from "../news//Date";
import {Grid} from "@mui/material";

export type ResearchLayoutProps = {
  title: string;
  description: string;
  publish_date: Date;
  slug: string;
  image: string;
  media: string[];
  body: any;
  children: React.ReactNode;
};
export default function ResearchLayout({
  title,
  description,
  publish_date,
  slug,
  media,
  image,
  body = "",
  children,
}: ResearchLayoutProps) {
  return (
    <>
      <div className={styles.container}>
        <article
          className={
            "text-stone-900 text-xl w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10"
          }
        >
          {/*<div className={"backlink"}>
            <Link href="/research" className={"no-underline"}>
              &larr; Back to all research
            </Link>
          </div>*/}
          <header>

            <Grid container spacing={0}>
              <Grid item xs>
                <h1 className={"guide-header"}>{title}</h1>
                <DateComponent className={"metadata"} date={publish_date} />
                <div className={styles.content}>{children}</div>
              </Grid>
              <Grid item xs={4}>
                <img src={`/${image}`} alt={"image"} />
              </Grid>
            </Grid>

            <Grid container spacing={0}>
              {media?.map((url) =>
                <Grid item xs={12} key={`url:${url}`}>
                  <a href={url} target={"_blank"} rel={'noreferrer noopener'}></a>
                </Grid>
              )}
            </Grid>

          </header>

        </article>
        <footer>
          <Copyright />
        </footer>
      </div>
      <style global jsx>
        {`
          /* Non-markdown Styles */

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
          .guide-header {
            margin: 0 0 0.5rem;
            font-size: 2.3rem;
          }
          .backlink {
            color: grey;
            margin-bottom: 1em;
          }
          .metadata div {
            display: inline-block;
            margin-right: 0.5rem;
          }
        `}
      </style>
    </>
  );
}
