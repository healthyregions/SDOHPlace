import React from "react";
import Link from "next/link";
import { PostContent } from "../../lib/posts";
import { TagContent } from "../../lib/tags";
import PostItem from "./PostItem";
import Pagination from "./Pagination";

type Props = {
  posts: PostContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function TagPostList({ posts, tag, pagination }: Props) {
  return (
    <div className={"post-list"}>
      <h1 className="mb-8 text-2xl">
        <Link href={"/news/"} className={"text-darkgray no-underline"}>
          All posts
        </Link>{" "}
        / <span>{tag.name}</span>
      </h1>
      <ul>
        {posts.map((it, i) => (
          <li key={i}>
            <PostItem post={it} />
          </li>
        ))}
      </ul>
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        link={{
          href: () => "/news/tags/[[...slug]]",
          as: (page) =>
            page === 1
              ? "/news/tags/" + tag.slug
              : `/news/tags/${tag.slug}/${page}`,
        }}
      />
    </div>
  );
}
