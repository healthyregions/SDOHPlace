import React from "react";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import Author from "./Author";
import Copyright from "./Copyright";
import Date from "./Date";
import ArticleMeta from "@/components/meta/ArticleMeta";
import TagButton from "./TagButton";
import { getAuthor } from "../../lib/authors";
import { getTag } from "../../lib/tags";

export type PostLayoutProps = {
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  thumbnail?: string;
  children: React.ReactNode;
};
export default function PostLayout({
  title,
  date,
  slug,
  author,
  tags,
  description = "",
  thumbnail,
  children,
}: PostLayoutProps) {
  const keywords = tags ? tags.map((it) => getTag(it).name) : [];
  const authorName = getAuthor(author).name;
  return (
    <>
      <ArticleMeta
        title={title}
        keywords={keywords}
        date={date}
        author={authorName}
        description={description}
        image={thumbnail}
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
            <h1 className={'post-header'}>{title}</h1>
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
      <style jsx>
        {`
          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
          .post-header {
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
        `}
      </style>
    </>
  );
}
