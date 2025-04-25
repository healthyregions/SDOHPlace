import { GetStaticProps } from "next";
import Header from "@/components/meta/Header";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import GuidesList from "@/components/guides/GuidesList";
import config from "@/lib/config";
import {
  countGuides,
  listGuidesContent,
  GuidesContent
} from "@/lib/guides";
import { listTags, TagContent } from "@/lib/tags";

type Props = {
  guides: GuidesContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ guides, tags, pagination }: Props) {
  return (
    <>
    <Header url="/guides" title="SDOH Guides" />
    <NavBar />
    <TopLines />
    <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
            <h1 className="font-fredoka">SDOH Guides</h1>
            <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                        <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-8">
                            <p>
                            While there exists a long and complex history studying the role of place, social context, and the built environment within health, current and common frameworks of the “social determinants of health” (SDoH) tend to be simplistic in application. The SDOH & Place Project works to build a community of practice around defining & using community-level social determinants of health. To support these efforts, SDOH Research Guides help focus and refine best practices and approaches in measuring distinct SDOH indicators or structural drivers of health at community or regional scales.
                            </p>
                            <br />
                            <p>
                            The SDOH Guides are written by new and emerging scholars across the fields of SDOH research (ex. geography, social science, public health). Each guide takes a view on some SDOH topic, breaking down the jargon to clarify understanding and provide direct recommendations. The SDOH Guides will continue to be updated and changed, according to research directions that unfold.
                            </p>
                        </div>
                        <GuidesList guides={guides} pagination={pagination} />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
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
