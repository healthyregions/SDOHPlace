import type { NextPage } from "next";
import Head from "next/head";
import ContactUs from "@/components/contact-us";

import styles from "./index.module.css";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>SDOH & Place</title>
        <meta name="description" content="Homepage for the place project" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          async
        ></script>
      </Head>
      <ContactUs />
    </>
  );
};

export default Page;
