import React from "react";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import Author from "./Author";
import Copyright from "./Copyright";
import DateComponent from "./Date";
import Layout from "./Layout";
import BasicMeta from "./meta/BasicMeta";
import JsonLdMeta from "./meta/JsonLdMeta";
import OpenGraphMeta from "./meta/OpenGraphMeta";
import TwitterCardMeta from "./meta/TwitterCardMeta";
import TagButton from "./TagButton";
import { getAuthor } from "../../lib/authors";
import { getTag } from "../../lib/tags";
import { getFellow } from "../../lib/people";
import Image from "next/image";

export type PostLayoutProps = {
  // Shared
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  description?: string;
  children: React.ReactNode;

  // PostLayout
  author?: string;
  showJsonLd?: boolean;
  showMetadata?: boolean;

  // ShowcaseLayout
  fellowName?: string;
  image?: string;
  link?: string;
  techUsed?: string;
  pathPrefix?: string;
  backButtonText?: string;
};
export default function PostLayout({
  title,
  date,
  slug,
  author,
  tags,
  link,
  image,
  fellowName,
  techUsed,
  description = "",
  children,
  showJsonLd = true,
  showMetadata = true,
  pathPrefix = '/news',
  backButtonText = 'Back to all posts'
}: PostLayoutProps) {
  const keywords = tags ? tags.map((it) => getTag(it).name) : [];
  const authorName = getAuthor(author).name;
  const fellow = getFellow(fellowName);
  return (
    <Layout>
      <BasicMeta
        url={`${pathPrefix}/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`${pathPrefix}/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`${pathPrefix}/${slug}`}
        title={title}
        description={description}
      />
        {
            showJsonLd && <JsonLdMeta
                url={`${pathPrefix}/${slug}`}
                title={title}
                keywords={keywords}
                date={date}
                author={authorName}
                description={description}
              />
        }
      <div className={styles.container}>
        <article
          className={
            "text-stone-900 text-xl w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10"
          }
        >
          <div className={"backlink"}>
            <Link href={pathPrefix} className={"no-underline"}>
              &larr; {backButtonText}
            </Link>
          </div>
          <header>
            <h1>{title}</h1>
              {
                  showMetadata && <div className={"metadata"}>
                      <div>
                        <DateComponent date={date} />
                      </div>
                      <div>
                        <Author author={getAuthor(author)} />
                      </div>
                    </div>
              }
          </header>
            {
                image && <div className="relative">
                    <Image
                        src={image}
                        alt="ad"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }} // optional
                    />
                </div>
            }
            { fellowName && fellow && link && <div className={styles.metadata}>
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
            }
          <div className={styles.content}>{children}</div>
            { tags && <ul className={"tag-list"}>
                {tags.map((it, i) => (
                    <li key={i}>
                      <TagButton tag={getTag(it)} />
                    </li>
                  ))}
                </ul>
            }
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
