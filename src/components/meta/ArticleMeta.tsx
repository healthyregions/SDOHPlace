import { Article } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import config from "@/lib/config";
import { formatISO } from "date-fns";
import Head from "next/head";
import { usePathname } from 'next/navigation';
import mainLogo from "@/public/logos/place-project-logo-hero.png";

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

    const t = title ? [title, config.site_title].join(" | ") : config.site_title;
    const d = description ? description : config.site_description;
    const u = config.base_url + usePathname();
    const a = author ? author : "Healthy Regions & Policies Lab, University of Illinois, Urbana-Champaign";
    const i = image ? config.base_url + image : config.base_url + mainLogo.src
    const k = keywords ? keywords : config.site_keywords
  return (
    <Head>
        <title>{t}</title>
        <meta property="og:title" content={t} />
        <link rel="canonical" href={u} />
        <meta property="og:url" content={u} />
        <meta name="description" property="og:description" content={d} />
        <meta name="image" property="og:image" content={i} />
        <meta
            name="keywords"
            content={k.join(",")}
        />
        <meta name="author" content={a} />

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
