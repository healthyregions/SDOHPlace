import { GetStaticProps, GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import matter from "gray-matter";
import { fetchShowcaseContent } from "../../lib/showcases";
import fs from "fs";
import yaml from "js-yaml";
import { parseISO } from "date-fns";

import InstagramEmbed from "react-instagram-embed";
import YouTube from "react-youtube";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Layout from "@/components/Layout";

export type Props = {
  title: string;
  dateString: string;
  slug: string;
  image: string;
  link: string;
  tags: string[];
  fellowName: string;
  techUsed?: string;
  description?: string;
  source: MDXRemoteSerializeResult;
};

const components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
};
const slugToPostContent = ((postContents) => {
  let hash = {};
  postContents.forEach((it) => (hash[it.slug] = it));
  return hash;
})(fetchShowcaseContent("content/showcase"));

export default function Showcase({
  title,
  dateString,
  slug,
  image,
  link,
  tags,
  fellowName,
  techUsed = "",
  description = "",
  source,
}: Props) {
  const showcase_props = {
    title,
    date: parseISO(dateString),
    slug,
    image,
    link,
    tags,
    fellowName,
    techUsed,
    description,
    children: <MDXRemote {...source} components={components} />
  }
  return (
    <>
      <Layout
        type={'showcase'}
        showcase_props={showcase_props}
      >
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchShowcaseContent("content/showcase").map(
    (it) => "/showcase/" + it.slug
  );
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.showcase as string;
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });
  const mdxSource = await serialize(content);
  return {
    props: {
      title: data.title,
      slug: slug,
      image: data.image,
      techUsed: data.tech_used ? data.tech_used : "",
      link: data.link,
      fellowName: data.fellow,
      source: mdxSource,
    },
  };
};
