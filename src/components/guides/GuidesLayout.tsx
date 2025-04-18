import React from "react";
import styles from "@/public/styles/posts.module.css";
import Author from "../news/Author";
import Copyright from "../news/Copyright";
import DateComponent from "../news//Date";

export type GuideLayoutProps = {
  title: string;
  last_updated: Date;
  slug: string;
  featured_image: string;
  author: string;
  body: any;
  children: React.ReactNode;
};
export default function GuidesLayout({
  title,
  last_updated,
  slug,
  author,
  featured_image,
  body = "",
  children,
}: GuideLayoutProps) {
  const authorObject = { name: author, slug: null, introduction: null };
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
                <DateComponent date={last_updated} />
              </div>
              <div>
                <Author author={authorObject} />
              </div>
            </div>
            <div>
              <img src={featured_image} alt={"featured_image"} />
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
