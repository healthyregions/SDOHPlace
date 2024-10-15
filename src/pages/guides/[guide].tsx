import { GetStaticProps, GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import matter from "gray-matter";
import { fetchGuideContent } from "../../lib/guides";
import fs from "fs";
import yaml from "js-yaml";
import { parseISO } from "date-fns";

import InstagramEmbed from "react-instagram-embed";
import YouTube from "react-youtube";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Layout from "@/components/Layout";

export type Props = {
  title: string;
  lastUpdatedString: string;
  slug: string;
  featured_image: string;
  author: string;
  body?: string;
  source: MDXRemoteSerializeResult;
};

const components = {
  InstagramEmbed,
  YouTube,
  TwitterTweetEmbed,
};
const slugToGuideContent = ((guideContents) => {
  let hash = {};
  guideContents.forEach((it) => (hash[it.slug] = it));
  return hash;
})(fetchGuideContent());

export default function Guide({
                               title,
                               lastUpdatedString,
                               slug,
                               featured_image,
                               author,
                               body = "",
                               source,
                             }: Props) {
  const guide_props = {
    title,
    last_updated: parseISO(lastUpdatedString),
    slug,
    featured_image,
    author,
    body,
    children: <MDXRemote {...source} components={components} />
  };
  return (
    <>
      <Layout
        type={'guide'}
        guide_props={guide_props}
      ></Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchGuideContent().map((it) => "/guides/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.post as string;
  const source = fs.readFileSync(slugToGuideContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  });
  const mdxSource = await serialize(content);
  return {
    props: {
      title: data.title,
      lastUpdatedString: data.last_updated,
      slug: slug,
      body: data.body,
      featured_image: data.featured_image,
      author: data.author,
      source: mdxSource,
    },
  };
};
