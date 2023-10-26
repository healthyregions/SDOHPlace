import type { NextPage } from "next";
import Header from "@/components/Header";
import HomePage from "@/components/homepage";

import styles from "./index.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Header title={null} />
      <HomePage></HomePage>
    </>
  );
};

export default Home;
