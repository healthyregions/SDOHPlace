import Link from "next/link";
import { TagContent } from "../../lib/tags";

type Props = {
  tag: TagContent;
};
export default function Tag({ tag }: Props) {
  return (
    <Link
      href={"/news/tags/[[...slug]]"}
      as={`/news/tags/${tag.slug}`}
      className={"no-underline"}
    >
      {"#" + tag.name}
    </Link>
  );
}
