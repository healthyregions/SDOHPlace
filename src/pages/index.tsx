import type { NextPage } from "next";
import Head from "next/head";
import HomePage from "@/components/homepage";

import styles from "./index.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SDOH & Place</title>
        <meta name="description" content="Homepage for the place project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage></HomePage>
    </>
  );
};

export default Home;
