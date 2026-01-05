import React from "react";
import Link from "next/link";
import { ShowcaseContent } from "@/lib/showcases";
import { TagContent } from "@/lib/tags";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";

type Props = {
  showcases: ShowcaseContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function TagShowcaseList({ showcases, tag, pagination }: Props) {
  return (
    <div className={"post-list"}>
      <h1 className="mb-8 text-2xl">
        <Link href={"/showcase/"} className={"text-darkgray no-underline"}>
          All showcases
        </Link>{" "}
        / <span>{tag.name}</span>
      </h1>
      <ul>
        {showcases.map((it, i) => (
          <li key={i}>
            <ShowcaseItem item={it} />
          </li>
        ))}
      </ul>
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        link={{
          href: () => "/showcase/tags/[[...slug]]",
          as: (page) =>
            page === 1
              ? "/showcase/tags/" + tag.slug
              : `/showcase/tags/${tag.slug}/${page}`,
        }}
      />
    </div>
  );
}
