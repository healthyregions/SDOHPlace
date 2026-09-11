import React from "react";
import type { PostersContent } from "../../lib/posters";
import PostersItem from "./PostersItem";
import Pagination from "../news/Pagination";

type Props = {
  posters: PostersContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostersList({ posters, pagination }: Props) {
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
          {posters?.map((it, i) => (
            <li key={i}>
              <PostersItem item={it} />
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
