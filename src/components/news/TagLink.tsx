import Link from "next/link";
import { TagContent } from "../../lib/tags";

type Props = {
  tag: TagContent;
  prefix: string;
};
export default function TagLink({ tag, prefix }: Props) {
  return (
    <Link
      href={prefix + "/[[...slug]]"}
      as={`${prefix}/${tag.slug}`}
      className={"no-underline"}
    >
      {"#" + tag.name}
    </Link>
  );
}
