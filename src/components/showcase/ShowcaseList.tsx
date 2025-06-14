import React from "react";
import { ShowcaseContent } from "../../lib/showcases";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";
import {Grid} from "@mui/material";
import Link from "next/link";

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
        <Grid container spacing={0} className={'mb-12'}>
          <Grid item xs={10}>
            Below are some of the impactful social determinants of health (SDOH)
            place-based data visualizations developed by our{" "}<Link href={'/fellows'}>SDOH & Place Fellows</Link>.
            To learn how to create your own, access our{" "}<Link href={'https://toolkit.sdohplace.org/'}>Community Toolkit</Link>.
          </Grid>
        </Grid>

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
