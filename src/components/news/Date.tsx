import { format, formatISO } from "date-fns";

type Props = {
  date: Date;
};
export default function Date({ className, date }: Props) {
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
