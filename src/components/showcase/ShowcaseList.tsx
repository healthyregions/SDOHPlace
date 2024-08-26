import React from "react";
import { ShowcaseContent } from "../../lib/showcases";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";

type Props = {
  posts: ShowcaseContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, pagination }: Props) {
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
          {posts.map((it, i) => (
            <li key={i}>
              <ShowcaseItem item={it} />
            </li>
          ))}
        </ul>
        {/* <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? "/news" : "/news/page/[page]"),
            as: (page) => (page === 1 ? null : "/news/page/" + page),
          }}
        /> */}
      </div>
    </>
  );
}
