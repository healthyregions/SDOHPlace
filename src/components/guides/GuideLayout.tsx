import React from "react";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import Author from "../news/Author";
import Copyright from "../news/Copyright";
import Date from "../news//Date";
import Layout from "../Layout";
import BasicMeta from "../news/meta/BasicMeta";
import JsonLdMeta from "../news/meta/JsonLdMeta";
import OpenGraphMeta from "../news/meta/OpenGraphMeta";
import TwitterCardMeta from "../news/meta/TwitterCardMeta";
import TagButton from "../news/TagButton";
import { getAuthor } from "../../lib/authors";
import { getTag } from "../../lib/tags";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Footer from "../homepage/footer";
import Image from "next/image";

export type GuideLayoutProps = {
  title: string;
  last_updated: Date;
  slug: string;
  featured_image: string;
  author: string;
  body: any;
  children: React.ReactNode;
};
export default function GuideLayout({
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
      {/*<BasicMeta
        url={`/guides/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/guides/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/guides/${slug}`}
        title={title}
        description={description}
      />
      <JsonLdMeta
        url={`/guides/${slug}`}
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
      />*/}
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
            <h1 className={'guide-header'}>{title}</h1>
            <div className={"metadata"}>
              <div>
                <Date date={last_updated} />
              </div>
              <div>
                <Author author={authorObject} />
              </div>
            </div>
            <div>
              <img src={featured_image} alt={'featured_image'} />
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
