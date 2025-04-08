import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import Header from "@/components/meta/Header";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import GuidesList from "@/components/guides/GuidesList";
import config from "@/lib/config";
import {
  countGuides,
  listGuidesContent,
  GuidesContent
} from "@/lib/guides";
import { listTags, TagContent } from "@/lib/tags";

type Props = {
  posts: GuidesContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ guides, tags, pagination }: Props) {
  const url = "/guides";
  const title = "SDOH Guides";
  return (
    <Layout page_header={"SDOH Guides"}>
      <Header url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <GuidesList guides={guides} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const guides = listGuidesContent( 1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countGuides() / config.posts_per_page),
  };
  return {
    props: {
      guides,
      tags,
      pagination,
    },
  };
};
