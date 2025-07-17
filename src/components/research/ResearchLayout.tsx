import React from "react";
import styles from "@/public/styles/posts.module.css";
import Author from "../news/Author";
import Copyright from "../news/Copyright";
import DateComponent from "../news//Date";

export type ResearchLayoutProps = {
  title: string;
  description: string;
  publish_date: Date;
  slug: string;
  image: string;
  media: string;
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
            <Link href="/guides" className={"no-underline"}>
              &larr; Back to all guides
            </Link>
          </div>*/}
          <header>
            <h1 className={"guide-header"}>{title}</h1>
            <div className={"metadata"}>
              <div>
                <DateComponent date={publish_date} />
              </div>
              <div>
                {/*<Author author={authorObject} />*/}
              </div>
            </div>
            <div>
              <img src={image} alt={"image"} />
            </div>
          </header>
          <div className={styles.content}>{children}</div>
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
