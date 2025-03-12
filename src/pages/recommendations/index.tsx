import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/news/meta/BasicMeta";
import OpenGraphMeta from "@/components/news/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/news/meta/TwitterCardMeta";
import PostList from "@/components/news/PostList";
import config from "../../lib/config";
import { countPosts, listPostContent, PostContent } from "../../lib/posts";
import { listTags, TagContent } from "../../lib/tags";
import {Grid} from "@mui/material";
import Link from "next/link";

const recommendations = [{
  name: 'Project 1',
  link: 'https://google.com',
  thumbnail: 'data:image/png;base64,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',
  excerpt: 'Example project that we would like to highlight for the following awesome reasons: 1) we like it, 2) it\'s pretty cool, and 3) you should know about it if you\'re interested in our platform',
}]

export default function Index({}) {
  return (
    <Layout page_header={'Things We Like!'}>
      {/* TODO: source Recommendations from DecapCMS */}
      <div className={'pb-[8rem]'}>
        {
          recommendations.map((rec, index) =>
            <Grid key={`recommendation-${index}`} spacing={4} container>
              <Grid item xs={2}>
                <img src={rec.thumbnail} />
              </Grid>
              <Grid item xs={6}>
                <h3>
                  <Link href={rec.link} className={'no-underline'} target={'_blank'}>
                    {rec.name}
                  </Link>
                </h3>
                <p>{rec.excerpt}</p>
              </Grid>
            </Grid>
          )
        }
      </div>

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
