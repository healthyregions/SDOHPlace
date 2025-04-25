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
          While there exists a long and complex history studying
          the role of place, social context, and the built environment within health,
          current and common frameworks of the “social determinants of health” (SDoH)
          tend to be simplistic in application. The SDOH & Place Project works to build
          a community of practice around defining & using community-level social
          determinants of health. To support these efforts, SDOH Research Guides help
          focus and refine best practices and approaches in measuring distinct SDOH
          indicators or structural drivers of health at community or regional scales.
          </p><br />
          <p>
          The SDOH Guides are written by new and emerging scholars across the fields of SDOH research (ex. geography, social science, public health). Each guide takes a view on some SDOH topic, breaking down the jargon to clarify understanding and provide direct recommendations. The SDOH Guides will continue to be updated and changed, according to research directions that unfold.
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
