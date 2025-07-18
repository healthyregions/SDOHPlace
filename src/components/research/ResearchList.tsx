import React from "react";
import { ResearchContent } from "@/lib/research";
import ResearchItem from "./ResearchItem";
import Pagination from "../news/Pagination";

type Props = {
  research: ResearchContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function ResearchList({ research, pagination }: Props) {
  console.log("ResearchList:", research);
  return (
    <>
      <div className={"post-list"}>
        <ul className={""}>
          {research.map((it, i) => (
            <li key={i}>
              <ResearchItem item={it} />
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
