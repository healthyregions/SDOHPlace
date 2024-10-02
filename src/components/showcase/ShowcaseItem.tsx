import { ShowcaseContent } from "../../lib/showcases";
import Image from "next/image";
import PostItem, {ItemProps} from "@/components/news/PostItem";

const getShowcaseContent = (item: ShowcaseContent) => <>
    <div style={{ display: "flex" }}>
        <Image src={item.image} alt={item.title} width={200} height={25} />
        <div style={{ paddingLeft: "2rem" }}>
            <h2 className={"item-title"}>{item.title}</h2>
            <p>{item.fellow}</p>
        </div>
    </div>
</>;

export default function ShowcaseItem({
    item,
    slugPrefix = '/showcase/',
    getContent = getShowcaseContent,
}: ItemProps) {
  return (
    <PostItem item={item}
              slugPrefix={slugPrefix}
              getContent={getContent}></PostItem>
  );
}
