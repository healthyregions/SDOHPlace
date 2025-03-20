import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Header from "@/components/meta/Header";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import ShowcaseList from "@/components/showcase/ShowcaseList";
import config from "../../lib/config";
import {
  countShowcases,
  listShowcaseContent,
  ShowcaseContent
} from "../../lib/showcases";
import { listTags, TagContent } from "../../lib/tags";

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
      <Header url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <ShowcaseList posts={posts} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = listShowcaseContent("content/showcase", 1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countShowcases("content/showcase") / config.posts_per_page),
  };
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
