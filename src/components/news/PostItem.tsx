import { PostContent } from "../../lib/posts";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";
import {ShowcaseContent} from "../../lib/showcases";

const getPostContent = (post: PostContent) => <>
    <Date date={parseISO(post.date)} />
    <h2 className={"item-title"}>{post.title}</h2>
</>;

export type ItemProps = {
  item: PostContent | ShowcaseContent;
  slugPrefix?: string;
  getContent?: Function;
};
export default function PostItem({
    item,
    slugPrefix = '/news/',
    getContent = getPostContent
}: ItemProps) {

  const css: string = `
      .item-link {
        color: #222;
        display: inline-block;
      }
      .item-title {
        margin: 0;
        font-size: 2rem;
      }
  `;

  return (
    <>
      <style>{css}</style>
      <Link href={slugPrefix + item.slug} legacyBehavior>
        <a className={"no-underline item-link"}>
          {getContent(item)}
        </a>
      </Link>
    </>
  );
}
