import { ShowcaseContent } from "../../lib/showcases";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {format, formatISO} from "date-fns";

type Props = {
  item: ShowcaseContent;
};
const PublishDate = ({ item }: Props) => {
  const publish_date = new Date(item.date);

  var now = new Date();
  now.setHours(0,0,0,0);
  if (publish_date < now) {
    // Selected date is in the past - print timestamp as normal
    return (
      <small>
        <time dateTime={formatISO(publish_date)}>
          <span>{format(publish_date, "LLLL d, yyyy")}</span>
        </time>
      </small>
    );
  } else {
    // Selected date is NOT in the past - determine season and print Coming Soon message
    const season = getSeason(publish_date);
    const year = publish_date.getFullYear();
    return (
      <small>
        Coming {(season && year) ? `in ${season} ${year}` : 'Soon!'}
      </small>
    );
  }
}

const getSeason = (publish_date: Date) => {
  switch (publish_date.getMonth()) {   // 0-indexed month (0 for January)
    case 11: // December
    case 0:  // January
    case 1:  // February
      return "Winter";
    case 2:  // March
    case 3:  // April
    case 4:  // May
      return "Spring";
    case 5:  // June
    case 6:  // July
    case 7:  // August
      return "Summer";
    case 8:  // September
    case 9:  // October
    case 10: // November
      return "Fall"; // Or "Autumn"
    default:
      return "Invalid Month"; // Should not happen with valid Date objects
  }
}
export default function ShowcaseItem({ item }: Props) {
  return (
    <>
      <Link href={`/showcase/${item.slug}`} legacyBehavior>
        <a className={"no-underline w-full"}>
          <div className={'flex max-md:flex-col'}>
            <div className={'flex-col'} style={{ minWidth: '200px' }}>
              <Image src={item.image} alt={item.title} width={200} height={25} />
            </div>
            <div className={'flex-col flex flex-grow-1'} style={{ paddingLeft: '2rem' }}>
              <div className={'flex flex-row'}>
                <h2>{item.title}</h2>
              </div>
              <div className={'flex flex-row flex-grow-1 justify-between'}>
                <div className={'flex-col'}>
                  <div>{item.fellow}</div>
                  <PublishDate item={item} />
                </div>
              </div>
              <div className={'mt-4'}>
                <Link className={'no-underline'} href={`/showcase/${item.slug}`}>
                  Access resource &rarr;
                </Link>
              </div>
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
    </>

  );

}
