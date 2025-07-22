import { Article } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import config from "@/lib/config";
import { formatISO } from "date-fns";
import Head from "next/head";
import { usePathname } from 'next/navigation'

type Props = {
  title: string;
  keywords?: string[];
  date?: Date;
  author?: string;
  image?: string;
  description?: string;
};
export default function ArticleMeta({
  title,
  keywords,
  date,
  author,
  image,
  description,
}: Props) {
    const u = config.base_url + usePathname();
    const i = image.startsWith("http") ? image : config.base_url + image
    const k = keywords ? keywords : config.site_keywords
  return (
    <Head>
        <meta property="og:type" content="article" />
        {date && <meta property="article:published_time" content={formatISO(date)} />}
        {k.map((i) => (
            <meta key={i.keyword} property="article:tag" content={i.keyword} />
        ))}
        <script
            {...jsonLdScriptProps<Article>({
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: u,
            headline: title,
            keywords: keywords ? keywords.join(",") : undefined,
            datePublished: date ? formatISO(date) : undefined,
            author: author,
            image: i,
            description: description,
            })}
        />
    </Head>
  );
}
