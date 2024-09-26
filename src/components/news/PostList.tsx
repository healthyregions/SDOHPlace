import React from "react";
import { PostContent } from "../../lib/posts";
import PostItem from "./PostItem";
import TagLink from "./TagLink";
import Pagination from "./Pagination";
import { TagContent } from "../../lib/tags";
import {ShowcaseContent} from "../../lib/showcases";
import ShowcaseItem from "@/components/showcase/ShowcaseItem";

const getContent = (item) => <PostItem item={item} />

export type ListProps = {
  posts: PostContent[] | ShowcaseContent[];
  tags?: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, tags, pagination }: ListProps) {
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
          {posts.map((it, i) => (
            <li key={i}>
                {getContent(it)}
            </li>
          ))}
        </ul>
          { pagination && <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? "/news" : "/news/page/[page]"),
            as: (page) => (page === 1 ? null : "/news/page/" + page),
          }}
        />}
      </div>
        { tags && <ul className={"categories"}>
            <li>
              <strong>Tags</strong>
            </li>
            {tags.map((it, i) => (
              <li key={i}>
                <TagLink tag={it} />
              </li>
            ))}
      </ul>}
    </>
  );
}
