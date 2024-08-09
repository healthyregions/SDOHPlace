import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/public/styles/posts.module.css";
import Author from "../news/Author";
import Copyright from "../news/Copyright";
import Date from "../news/Date";
import Layout from "../news/Layout";
import BasicMeta from "../news/meta/BasicMeta";
import JsonLdMeta from "../news/meta/JsonLdMeta";
import OpenGraphMeta from "../news/meta/OpenGraphMeta";
import TwitterCardMeta from "../news/meta/TwitterCardMeta";
import TagButton from "../news/TagButton";
import { getFellow } from "../../lib/people";
import { getTag } from "../../lib/tags";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Footer from "../homepage/footer";

type Props = {
  title: string;
  date: Date;
  slug: string;
  image: string;
  link: string;
  tags: string[];
  fellowName: string;
  techUsed: string;
  description?: string;
  children: React.ReactNode;
};
export default function ShowcaseLayout({
  title,
  image,
  link,
  slug,
  fellowName,
  techUsed,
  tags,
  description = "",
  children,
}: Props) {
  const keywords = tags ? tags.map((it) => getTag(it).name) : [];
  // const authorName = getAuthor(author).name;
  const fellow = getFellow(fellowName);
  return (
    <Layout>
      <BasicMeta
        url={`/showcase/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/showcase/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/showcase/${slug}`}
        title={title}
        description={description}
      />
      <div className={styles.container}>
        <article
          className={
            "text-stone-900 text-xl w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10"
          }
        >
          <div className={"backlink"}>
            <Link href="/showcase" className={"no-underline"}>
              &larr; Back to showcase
            </Link>
          </div>
          <header>
            <h1>{title}</h1>
          </header>
          <div className={"text-smokegray font-light italic text-base"}>
            <p>
              Earlier this year, we invited{" "}
              <Link href="/fellows">fifteen fellows</Link> to develop their own
              web mapping applications, centered on equity and designed with
              communities in mind, using the{" "}
              <Link href="https://toolkit.sdohplace.org">
                SDOH &amp; Place Toolkit
              </Link>
              . From July to September, we&apos;ll feature final fellow
              applications each week.
            </p>
          </div>
          <div className="relative">
            <Image
              src={image}
              alt="ad"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }} // optional
            />
          </div>
          <div className={styles.metadata}>
            <p style={{ marginTop: "0.5rem" }}>Tech used: {techUsed}</p>
            <p>
              By: <Link href={fellow.link}>{fellow.name}</Link>
            </p>
            <p>Fellow cohort: Spring 2024</p>
            <button
              onClick={() => {
                window.open(link, "_blank");
              }}
            >
              Explore App &rarr;
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </article>
        <footer>
          <Copyright />
        </footer>
      </div>
      <style jsx>
        {`
          .metadata div {
            display: inline-block;
            margin-right: 0.5rem;
          }
          article {
            flex: 1 0 auto;
          }
          h1 {
            margin: 0 0 0.5rem;
            font-size: 2.3rem;
          }
          .backlink {
            color: grey;
            margin-bottom: 1em;
          }
          .tag-list {
            list-style: none;
            text-align: right;
            margin: 1.75rem 0 0 0;
            padding: 0;
          }
          .tag-list li {
            display: inline-block;
            margin-left: 0.5rem;
          }
          .social-list {
            margin-top: 3rem;
            text-align: center;
          }

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
        `}
      </style>
      <style global jsx>
        {`
          /* Syntax highlighting */
          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata,
          .token.plain-text {
            color: #6a737d;
          }

          .token.atrule,
          .token.attr-value,
          .token.keyword,
          .token.operator {
            color: #d73a49;
          }

          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #22863a;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #032f62;
          }

          .token.function,
          .token.class-name {
            color: #6f42c1;
          }

          /* language-specific */

          /* JSX */
          .language-jsx .token.punctuation,
          .language-jsx .token.tag .token.punctuation,
          .language-jsx .token.tag .token.script,
          .language-jsx .token.plain-text {
            color: #24292e;
          }

          .language-jsx .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-jsx .token.tag .token.class-name {
            color: #005cc5;
          }

          .language-jsx .token.tag .token.script-punctuation,
          .language-jsx .token.attr-value .token.punctuation:first-child {
            color: #d73a49;
          }

          .language-jsx .token.attr-value {
            color: #032f62;
          }

          .language-jsx span[class="comment"] {
            color: pink;
          }

          /* HTML */
          .language-html .token.tag .token.punctuation {
            color: #24292e;
          }

          .language-html .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-html .token.tag .token.attr-value,
          .language-html
            .token.tag
            .token.attr-value
            .token.punctuation:not(:first-child) {
            color: #032f62;
          }

          /* CSS */
          .language-css .token.selector {
            color: #6f42c1;
          }

          .language-css .token.property {
            color: #005cc5;
          }
        `}
      </style>
    </Layout>
  );
}
