import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/public/styles/posts.module.css";
import Copyright from "../news/Copyright";
import { getFellow } from "../../lib/people";
import { getTag } from "../../lib/tags";

export type ShowcaseLayoutProps = {
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
}: ShowcaseLayoutProps) {
  const keywords = tags ? tags.map((it) => getTag(it).name) : [];
  // const authorName = getAuthor(author).name;
  const fellow = getFellow(fellowName);
  return (
    <>
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
            <h1 className={"showcase-header"}>{title}</h1>
          </header>
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
          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
          .showcase-header {
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
