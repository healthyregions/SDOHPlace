import React from "react";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import Author from "./Author";
import Copyright from "./Copyright";
import Date from "./Date";
import Layout from "../Layout";
import BasicMeta from "./meta/BasicMeta";
import JsonLdMeta from "./meta/JsonLdMeta";
import OpenGraphMeta from "./meta/OpenGraphMeta";
import TwitterCardMeta from "./meta/TwitterCardMeta";
import TagButton from "./TagButton";
import { getAuthor } from "../../lib/authors";
import { getTag } from "../../lib/tags";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Footer from "../homepage/footer";

export type PostLayoutProps = {
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  children: React.ReactNode;
};
export default function PostLayout({
  title,
  date,
  slug,
  author,
  tags,
  description = "",
  children,
}: PostLayoutProps) {
  const keywords = tags ? tags.map((it) => getTag(it).name) : [];
  const authorName = getAuthor(author).name;
  return (
    <>
      <BasicMeta
        url={`/news/${slug}`}
        title={title}
        keywords={keywords}
        description={description}
      />
      <TwitterCardMeta
        url={`/news/${slug}`}
        title={title}
        description={description}
      />
      <OpenGraphMeta
        url={`/news/${slug}`}
        title={title}
        description={description}
      />
      <JsonLdMeta
        url={`/news/${slug}`}
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
      />
      <div className={styles.container}>
        <article
          className={
            "text-stone-900 text-xl w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10"
          }
        >
          <div className={"backlink"}>
            <Link href="/news" className={"no-underline"}>
              &larr; Back to all posts
            </Link>
          </div>
          <header>
            <h1>{title}</h1>
            <div className={"metadata"}>
              <div>
                <Date date={date} />
              </div>
              <div>
                <Author author={getAuthor(author)} />
              </div>
            </div>
          </header>
          <div className={styles.content}>{children}</div>
          <ul className={"tag-list"}>
            {tags &&
              tags.map((it, i) => (
                <li key={i}>
                  <TagButton tag={getTag(it)} />
                </li>
              ))}
          </ul>
        </article>
        <footer>
          <Copyright />
        </footer>
      </div>
    </>
  );
}
