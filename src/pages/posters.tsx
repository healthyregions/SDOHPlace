import type {NextPage} from "next";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import PostersList from "@/components/posters/PostersList";
import {posters, PostersContent} from "@/lib/posters";
import {TagContent} from "@/lib/tags";
import React from "react";
import Link from "next/link";
import GuidesList from "@/components/guides/GuidesList";

type Props = {
  posters: PostersContent[];
  //tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
const Posters: NextPage = ({ /* tags, */ pagination }: Props) => {
  return (
    <>
      <BasicPageMeta title={"Posters"} />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">Poster Gallery</h1>

          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-16">
                  <p>A gallery of posters from upcoming and past SDOH&Place events.</p>
                </div>
                <PostersList posters={posters} pagination={pagination} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
};

export default Posters;
