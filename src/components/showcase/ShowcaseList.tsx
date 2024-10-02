import React from "react";
import { ShowcaseContent } from "../../lib/showcases";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";
import PostList, {ListProps} from "@/components/news/PostList";

const getShowcaseContent = (item) => <ShowcaseItem item={item} />

export default function ShowcaseList({ posts, pagination, getContent=getShowcaseContent }: ListProps) {
  return (
    <PostList posts={posts} pagination={pagination} tags={[]} getContent={getContent}></PostList>
  );
}
