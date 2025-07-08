import Head from "next/head";
import config from "@/lib/config";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";

type Props = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url?: string;
};

export default function Header({
  title,
  description,
  keywords,
  author,
  url,
}: Props) {
  return (
    <Head>
      <title>
        {title ? [title, config.site_title].join(" | ") : config.site_title}
      </title>
      <meta
        name="description"
        content={description ? description : config.site_description}
      />
      <meta
        name="keywords"
        content={
          keywords
            ? keywords.join(",")
            : config.site_keywords.map((it) => it.keyword).join(",")
        }
      />
      {author ? <meta name="author" content={author} /> : null}
      {url ? <link rel="canonical" href={config.base_url + url} /> : null}
      <script
        defer
        data-domain="sdohplace.org"
        src="https://plausible.io/js/script.pageview-props.tagged-events.js"
      ></script>
    </Head>
  );
}
