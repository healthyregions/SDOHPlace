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
import {Grid} from "@mui/material";

type Props = {
  guides: GuidesContent[];
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
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <Header url={url} title={title} />

          {/*
          <OpenGraphMeta url={url} title={title} />
          <TwitterCardMeta url={url} title={title} />
          */}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Proin et erat pellentesque augue consequat
            tincidunt vulputate ut metus. In mollis, dolor a
            molestie gravida, diam nunc tincidunt quam, id
            faucibus magna nisi sollicitudin velit. Sed mollis bibendum ullamcorper. Proin placerat
            dolor sed sagittis maximus. Pellentesque habitant
            morbi tristique senectus et netus et malesuada
            fames ac turpis egestas.
          </p>
        </Grid>

        <Grid item xs={12}>
          <GuidesList guides={guides} pagination={pagination} />
        </Grid>
      </Grid>
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
