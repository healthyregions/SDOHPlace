import { ShowcaseContent } from "../../lib/cms";
import Link from "next/link";

type Props = {
  item: ShowcaseContent;
};
export default function ShowcaseItem({ item }: Props) {
  return (
    <Link href={"/showcase/" + item.slug} legacyBehavior>
      <a className={"no-underline"}>
        <h2>{item.title}</h2>
        <p>{item.fellow}</p>
        <style jsx>
          {`
            a {
              color: #222;
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-size: 2rem;
            }
          `}
        </style>
      </a>
    </Link>
  );
}
