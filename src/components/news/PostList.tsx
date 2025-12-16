import React from "react";
import { PostContent } from "@/lib/posts";
import PostItem from "./PostItem";
import TagLink from "./TagLink";
import Pagination from "./Pagination";
import { TagContent } from "@/lib/tags";
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

const TagsList = ({ tags }) => <div className={' my-4 flex flex-col'}>
  <strong>Tags</strong>
  {/* Mobile: Display tags as a horizontal row  */}
  {/* Desktop: Display tags as a vertical list  */}
  <ul className={"flex flex-col max-md:flex-row"}>
    {tags.map((it, i) => (
      <li key={i} className={'mr-8'}>
        <TagLink tag={it} prefix={'/news/tags'} />
      </li>
    ))}
  </ul>
</div>;

const PostsTable = ({ className, posts, pagination }) => <>
  <ul className={className}>
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
</>

export default function PostList({ posts, tags, pagination }: Props) {
  return (
    <div className={"post-list"}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={10}>
          Here you can find information pertaining to events, calls for applications/interest,
          critical updates and information, and other news centered around the SDOH & Place Project.
          If you’d like to stay more up to date, subscribe to our monthly
          {" "}<Link href={'https://groups.webservices.illinois.edu/subscribe/192463'} target={'_blank'} rel={'noreferrer noopener'}>
          Newsletter</Link>.
        </Grid>

        <Grid item md={1}>{/* Intentional gap, since this version of Grid may not support "offset" */}</Grid>

        <Grid item xs={12} md={1}>
          <TagsList tags={tags}></TagsList>
        </Grid>
      </Grid>

      <PostsTable className={'mt-8'} posts={posts} pagination={pagination}></PostsTable>
    </div>
  );
}
