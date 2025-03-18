import Head from "next/head";

export default function Header({ title }) {
  return (
    <Head>
      <title>
        {title ? `${title} | SDOH & Place Project` : "SDOH & Place Project"}
      </title>
      <meta
        name="description"
        content="Homepage for the SDOH & Place project from Healthy Regions & Policies Lab"
      />
      <link rel="icon" href="/favicon.ico" />
      <script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        async
      ></script>
      <script
        defer
        data-domain="sdohplace.org"
        src="https://plausible.io/js/script.pageview-props.tagged-events.js"
      ></script>
    </Head>
  );
}
