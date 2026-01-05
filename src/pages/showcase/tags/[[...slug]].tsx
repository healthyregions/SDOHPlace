import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@/components/Layout";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import TagShowcaseList from "@/components/showcase/TagShowcaseList";
import config from "@/lib/config";
import { countShowcases, listShowcaseContent, ShowcaseContent } from "@/lib/showcases";
import { getShowcaseTag, listShowcaseTags, TagContent } from "@/lib/tags";

type Props = {
  showcases: ShowcaseContent[];
  tag: TagContent;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ showcases, tag, pagination, page }: Props) {
  const url = `/showcase/tags/${tag.name}` + (page ? `/${page}` : "");
  const title = tag.name;
  return (
    <Layout>
      <BasicPageMeta title={title} />
      <TagShowcaseList showcases={showcases} tag={tag} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queries = params.slug as string[];
  const [slug, page] = [queries[0], queries[1]];
  const showcases = listShowcaseContent(
    page ? parseInt(page as string) : 1,
    config.posts_per_page,
    slug
  );
  const tag = getShowcaseTag(slug);
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil(countShowcases() / config.posts_per_page),
  };
  const props: {
    showcases: ShowcaseContent[];
    tag: TagContent;
    pagination: { current: number; pages: number };
    page?: string;
  } = { showcases, tag, pagination };
  if (page) {
    props.page = page;
  }
  return {
    props,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = listShowcaseTags().flatMap((tag) => {
    const pages = Math.ceil(countShowcases(tag.slug) / config.posts_per_page);
    return Array.from(Array(pages).keys()).map((page) =>
      page === 0
        ? {
            params: { slug: [tag.slug] },
          }
        : {
            params: { slug: [tag.slug, (page + 1).toString()] },
          }
    );
  });
  return {
    paths: paths,
    fallback: false,
  };
};
