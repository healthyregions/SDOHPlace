import type {NextPage} from "next";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import PostersList from "@/components/posters/PostersList";
import {PostersContent} from "@/lib/posters";
import {TagContent} from "@/lib/tags";

type Props = {
  posters: PostersContent[];
  //tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
const Posters: NextPage = ({ posters, /* tags, */ pagination }: Props) => {
  return (
    <>
      <BasicPageMeta title={"Posters"} />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">Posters</h1>
        </div>
      </div>

      <PostersList posters={posters} pagination={pagination} />
    </>
  )
};

export default Posters;
