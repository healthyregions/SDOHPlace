import { GetStaticProps } from "next";
import Layout from "@/components/news/Layout";
import BasicMeta from "@/components/news/meta/BasicMeta";
import OpenGraphMeta from "@/components/news/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/news/meta/TwitterCardMeta";
import ShowcaseList from "@/components/showcase/ShowcaseList";
import config from "../../lib/config";
import {
  countPosts,
  listPostContent,
  ShowcaseContent,
} from "../../lib/showcases";
import { listTags, TagContent } from "../../lib/tags";
import Head from "next/head";

type Props = {
  posts: ShowcaseContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tags, pagination }: Props) {
  const url = "/showcase";
  const title = "Showcase";
  return (
    <Layout page_header={"Fellows Showcase"}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <ShowcaseList posts={posts} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = listPostContent("content/showcase", 1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countPosts("content/showcase") / config.posts_per_page),
  };
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
