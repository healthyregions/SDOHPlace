import React from "react";
import { ShowcaseContent } from "../../lib/showcases";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";
import {ListProps} from "@/components/news/PostList";

const getContent = (item) => <ShowcaseItem item={item} />

export default function ShowcaseList({ posts, pagination }: ListProps) {
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
