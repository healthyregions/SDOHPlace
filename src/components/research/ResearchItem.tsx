import { ResearchContent } from "@/lib/research";
import Image from "next/image";
import Link from "next/link";
import styles from "@/public/styles/posts.module.css";
import React from "react";
import {Grid, Icon} from "@mui/material";
import {format, formatISO} from "date-fns";
import {Launch} from "@mui/icons-material";


type Props = {
  item: ResearchContent;
};

const PublishDate = ({ item }: Props) => {
  const publish_date = new Date(item.publish_date);

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

export default function ResearchItem({ item }: Props) {
  return (
    <>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Image src={item.image} alt={item.title} width={200} height={25} />
          </Grid>
          <Grid item xs>
            <h2>{item.title}</h2>
            <div>{item.author}</div>
            <PublishDate item={item} />
            <p className={'mt-4'}>{item.description}</p>
            {
              item.media?.map(url =>
                <a className={'no-underline mt-4'} key={url} href={url} target="_blank" rel="noopener noreferrer">
                  Access resource <Launch />
                </a>
              )
            }
          </Grid>
        </Grid>
        <style jsx>
          {`
            a {
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-size: 2rem;
            }
          `}
        </style>
    </>
  );
}
