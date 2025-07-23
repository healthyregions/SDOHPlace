import { GetStaticProps } from "next";
import Layout from "@/components/Layout";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
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
  return (
    <>
        <BasicPageMeta title="Showcase" />
        <NavBar />
        <TopLines />
        <div className="flex flex-col pt-12">
            <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
                <h1 className="font-fredoka">Fellows Showcase</h1>
                <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
                    <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                        <div className="flex items-stretch w-[92%] max-md:w-full max-md:ml-0">
                            <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-8"></div>
                            <ShowcaseList posts={posts} pagination={pagination} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
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
