import { format, formatISO } from "date-fns";

export default function Date({ className, date }) {
  return (
    <time dateTime={formatISO(date)} className={className}>
      <span>{format(date, "LLLL d, yyyy")}</span>
      <style jsx>
        {`
          span {
            color: #9b9b9b;
          }
        `}
      </style>
    </time>
  );
}
