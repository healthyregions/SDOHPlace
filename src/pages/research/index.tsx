import { GetStaticProps } from "next";
import Header from "@/components/meta/Header";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import ResearchList from "@/components/research/ResearchList";
import config from "@/lib/config";
import {
  countResearch,
  listResearchContent,
  ResearchContent
} from "@/lib/research";

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
    <Header url="/research" title="SDOH Research Outputs" />
    <NavBar />
    <TopLines />
    <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
            <h1 className="font-fredoka">SDOH Research Outputs</h1>
            <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                        <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-16">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                          <p>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <p>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
