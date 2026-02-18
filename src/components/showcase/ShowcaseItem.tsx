import { ShowcaseContent } from "../../lib/showcases";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  item: ShowcaseContent;
};
const PublishDate = ({ item }: Props) => {
  const dateObj = new Date(item.date);

// Format as "February 10, 2026"
  const publish_date = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);

  // Selected date is in the past - print timestamp as normal
  return (
    <small>
      <time dateTime={publish_date}>
        <span>{publish_date}</span>
      </time>
    </small>
  );
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

              <div className={'mt-4'} style={{ color: '#7e1cc4' }}>Access resource &rarr;</div>
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
