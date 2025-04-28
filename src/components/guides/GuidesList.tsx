import React from "react";
import { GuidesContent } from "../../lib/guides";
import GuidesItem from "./GuidesItem";
import Pagination from "../news/Pagination";

type Props = {
  guides: GuidesContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function GuidesList({ guides, pagination }: Props) {
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
          {guides.map((it, i) => (
            <li key={i}>
              <GuidesItem item={it} />
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
