import { GetStaticProps } from "next";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import ResearchList from "@/components/research/ResearchList";
import config from "@/lib/config";
import {
  countResearch,
  listResearchContent,
  ResearchContent
} from "@/lib/research";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import * as React from "react";

type Props = {
  research: ResearchContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ research, pagination }: Props) {
  console.log("Listed:", research);
  return (
    <>
    <BasicPageMeta title={"Research & Reports"} description="Reports, research articles, and related products from the SDOH & Place Project" />
    <NavBar />
    <TopLines />
    <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
            <h1 className="font-fredoka">Research & Reports</h1>
            <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                        <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-16">
                          <p>
                            The SDOH & Place team regularly releases reports, research articles, and related products. Learn more about our work to advance the measurement and understanding of the Social Determinants of Health and structural drivers of health!
                           </p>
                        </div>
                        <ResearchList research={research} pagination={pagination} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const research = listResearchContent( 1, config.posts_per_page);
  const pagination = {
    current: 1,
    pages: Math.ceil(countResearch() / config.posts_per_page),
  };
  return {
    props: {
      research,
      pagination,
    },
  };
};
