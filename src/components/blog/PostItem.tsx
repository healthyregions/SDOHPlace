import { PostContent } from "../../lib/posts";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";

type Props = {
  post: PostContent;
};
export default function PostItem({ post }: Props) {
  return (
    <Link href={"/blog/" + post.slug} legacyBehavior>
      <a>
        <Date date={parseISO(post.date)} />
        <h2>{post.title}</h2>
        <style jsx>
          {`
            a {
              color: #222;
              display: inline-block;
              font-family: "Nunito";
            }
            h2 {
              margin: 0;
              font-size: "3.5rem";
              font-weight: 700;
              font-family: "Nunito";
            }
          `}
        </style>
      </a>
    </Link>
  );
}
