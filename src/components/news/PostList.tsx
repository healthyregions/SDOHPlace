import React from "react";
import { PostContent } from "../../lib/posts";
import PostItem from "./PostItem";
import TagLink from "./TagLink";
import Pagination from "./Pagination";
import { TagContent } from "../../lib/tags";
import {Grid} from "@mui/material";
import Link from "next/link";

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
        <Grid container spacing={0} className={'mb-8'}>
          <Grid item xs={10}>
            Here you can find information pertaining to events, calls for applications/interest,
            critical updates and information, and other news centered around the SDOH & Place Project.
            If you’d like to stay more up to date, subscribe to our monthly
            {" "}<Link href={'https://groups.webservices.illinois.edu/subscribe/192463'} target={'_blank'} rel={'noreferrer noopener'}>
            Newsletter
          </Link>.
          </Grid>
        </Grid>

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
