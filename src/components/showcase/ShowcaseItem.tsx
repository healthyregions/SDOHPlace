import { ShowcaseContent } from "../../lib/cms";
import Image from "next/image";
import Link from "next/link";

type Props = {
  item: ShowcaseContent;
};
export default function ShowcaseItem({ item }: Props) {
  return (
    <Link href={"/showcase/" + item.slug} legacyBehavior>
      <a className={"no-underline"}>
        <div style={{ display: "flex" }}>
          <div>
            <Image src={item.image} alt={item.title} width={200} height={25} />
          </div>
          <div style={{ paddingLeft: "2rem" }}>
            <h2>{item.title}</h2>
            <p>{item.fellow}</p>
          </div>
        </div>
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
