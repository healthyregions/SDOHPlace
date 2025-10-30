import { GetStaticProps } from "next";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
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
import Link from "next/link";


export default function Index() {
  return (
    <>
      <BasicPageMeta title="Call for Guides" />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">Call for Guides</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-16">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed faucibus leo felis, quis auctor dolor dignissim at.
                    Praesent ex velit, vestibulum sit amet tempus sed, placerat
                    in arcu. Sed ut tempor sapien. Etiam pulvinar est ac
                    augue rhoncus fermentum. Vestibulum et nibh urna. Orci varius
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Vivamus condimentum neque aliquet, varius odio
                    sit amet, fermentum diam. Maecenas elementum suscipit semper.
                    Pellentesque bibendum maximus consequat. Mauris a arcu at leo
                    faucibus dignissim. Sed at tincidunt lectus. Sed efficitur in
                    enim a facilisis. Nunc non hendrerit risus, nec aliquet justo.
                    Etiam vitae accumsan nunc.
                  </p>
                  <br />
                  <p>
                    Morbi vel diam risus. Mauris ultrices tempor condimentum.
                    Pellentesque quis ante quis mauris iaculis ultricies nec
                    at est. Duis ultrices efficitur tincidunt. Fusce consectetur
                    luctus lacus, sed laoreet diam vestibulum non. Donec faucibus
                    gravida odio, ac semper arcu facilisis in. Curabitur rutrum,
                    libero bibendum faucibus dignissim, lectus erat condimentum nulla,
                    sit amet luctus lacus elit vel ex. Donec accumsan, nisi quis
                    eleifend iaculis, ligula risus semper nunc, et pretium arcu justo
                    pretium mauris. Duis semper bibendum urna vitae fringilla. Nam
                    accumsan volutpat turpis, a mollis nibh venenatis vitae. Aenean
                    id gravida libero. Vivamus posuere turpis sed dui vulputate, eget
                    fermentum orci aliquet. Nullam et dignissim tellus. Donec quis lacus
                    rhoncus, cursus dolor id, lobortis elit. Maecenas efficitur diam
                    tortor, id facilisis neque lacinia ac.
                  </p>
                </div>
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
