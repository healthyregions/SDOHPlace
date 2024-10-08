import React from "react";
import { PostContent } from "../../lib/posts";
import PostItem from "./PostItem";
import TagLink from "./TagLink";
import Pagination from "./Pagination";
import { TagContent } from "../../lib/tags";

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, tags, pagination }: Props) {
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
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
            href: (page) => (page === 1 ? "/news" : "/news/page/[page]"),
            as: (page) => (page === 1 ? null : "/news/page/" + page),
          }}
        />
      </div>
      <ul className={"categories"}>
        <li>
          <strong>Tags</strong>
        </li>
        {tags.map((it, i) => (
          <li key={i}>
            <TagLink tag={it} />
          </li>
        ))}
      </ul>
    </>
  );
}
