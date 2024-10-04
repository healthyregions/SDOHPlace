import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/public/styles/posts.module.css";
import Copyright from "../news/Copyright";
import Date from "../news/Date";
import BasicMeta from "../news/meta/BasicMeta";
import OpenGraphMeta from "../news/meta/OpenGraphMeta";
import TwitterCardMeta from "../news/meta/TwitterCardMeta";
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
    </>
  );
}
