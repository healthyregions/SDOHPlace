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
          
          /* Headers */
          
          h1 {
            font-family: 'Fredoka', sans-serif;
            color: #7E1CC4;
            font-weight: 400;
            font-size: 48px;
            letter-spacing: 0.2px;
          }

          h2 {
            font-family: 'Fredoka', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 36px;
            border-left: solid 4px;
            border-color: #FF9C77;
            padding-left: 11px !important;
          }

          h3 {
            font-family: 'Fredoka', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 24px;
          }

          h4 {
            font-family: 'Fredoka', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 18px;
          }
          
          h5 > em {
            font-style: normal;
          }

          
          /* Lists */
          
          ul {
            font-family: 'Nunito', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 18px;
          }

          ul li::marker {
            color: #FF9C77;
          }

          ol {
            font-family: 'Nunito', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 18px;
          }

          
          /*  Details + Summary */

          details, details summary {
            font-family: 'Nunito', sans-serif;
            color: #1E1E1E;
            font-weight: 400;
            font-size: 18px;
          }

          details summary {
            margin-bottom: 1rem;
          }

          summary::marker {
            color: #FF9C77;
          }

          summary strong {
            font-weight: 400 !important;
          }

          
          /* Links / Anchors */
          
          a {
            text-decoration: none !important;
            font-weight: 400;
          }
          
          
          /* Image Captions */
          
          p.caption, .figcaption {
            font-family: 'Fredoka', sans-serif;
            color: #333333;
            margin-bottom: 2rem;
            font-style: italic;
          }
          
          /* Tables */ 
          
          table tr {
            font-family: 'Nunito', sans-serif;
            border-top: 2px solid #FFE5C4 !important;
            line-height: 27.2px;
          }
          
          table tr th {
            background-color: #fff;
            font-weight: 700;
            border-bottom: 2px solid #FFE5C4;
          }
          
          table td, table th {
            border-left: none !important;
            border-right: none !important;
          }

          table {
            font-family: 'Nunito', sans-serif;
            font-size: 16px;
            color: #333333;
            overflow-x: auto;
            width: 100%;
          }

          table tr td:first-child {
            min-width: 200px !important;
          }

          table tbody tr:nth-child(odd) {
            background-color: #fff;
          }

          table tbody tr:nth-child(even) {
            background-color: #FFFAF3;
          }
          
          table tbody tr:last-child {
            border-bottom: 3px solid #FFE5C4;
          }
          
          table td {
            text-align: left;
          }

          
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
