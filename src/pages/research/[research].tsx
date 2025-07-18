import { GetStaticProps, GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { fetchResearchContent } from "@/lib/research";
import fs from "fs";
import yaml from "js-yaml";

import InstagramEmbed from "react-instagram-embed";
import YouTube from "react-youtube";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Layout from "@/components/Layout";

export type Props = {
  title: string;
  description: string;
  publish_date: string;
  slug: string;
  image: string;
  media: string[];
  body?: string;
  source: MDXRemoteSerializeResult;
};

const components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
};
const slugToResearchContent = ((researchContents) => {
  const hash = {};
  researchContents.forEach((it) => (hash[it.slug] = it));
  return hash;
})(fetchResearchContent());

export default function Research({
  title,
  description,
  publish_date,
  slug,
  image,
  media,
  body = "",
  source,
}: Props) {
  return (
    <>
      <Layout type={"research"} research_props={{
        title,
        description,
        publish_date: new Date(publish_date),
        slug,
        image,
        media,
        body,
        children: <MDXRemote {...source} components={components} />,
      }}></Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchResearchContent().map((it) => "/research/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.research as string;
  const source = fs.readFileSync(slugToResearchContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });
  const mdxSource = await serialize(content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  });
  return {
    props: {
      title: data.title,
      publish_date: data.publish_date,
      slug,
      //description: data.description,
      //body: data.body,
      image: data.image,
      media: data.media,
      source: mdxSource,
    },
  };
};
