import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/news/meta/BasicMeta";
import OpenGraphMeta from "@/components/news/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/news/meta/TwitterCardMeta";
import PostList from "@/components/news/PostList";
import config from "../../lib/config";
import { countPosts, listPostContent, PostContent } from "../../lib/posts";
import { listTags, TagContent } from "../../lib/tags";

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tags, pagination }: Props) {
  const url = "/recommendations";
  const title = "Things We Like!";
  return (
    <Layout page_header={"Things We Like!"}>
      {/* TODO: source Recommendations from DecapCMS */}
      <ul>
        <li>Project 1</li>
        <li>Project 2</li>
        <li>Project 3</li>
      </ul>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = listPostContent(1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countPosts() / config.posts_per_page),
  };
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
