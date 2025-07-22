import Head from "next/head";
import mainLogo from "@/public/logos/place-project-logo-hero.png";
import config from "@/lib/config";
import { usePathname } from 'next/navigation'

type Props = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
};

export default function BasicPageMeta({
  title,
  description,
  keywords,
  author,
  image,
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
        <meta name="description" content={d} />
        <meta
            name="keywords"
            content={k.join(",")}
        />
        <meta name="author" content={a} />
        <link rel="canonical" href={u} />

        <meta property="og:url" content={u} />
        <meta property="og:title" content={t} />
        <meta property="og:description" content={d} />
        <meta property="og:image" content={i} />
    </Head>
  );
}
