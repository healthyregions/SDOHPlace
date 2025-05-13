"use client";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Header from "@/components/meta/Header";
import NavBar from "@/components/NavBar";
import * as React from "react";
import { getSchema, SchemaObject } from "@/components/search/helper/GetSchema";
import Footer from "@/components/homepage/footer";
import DiscoveryArea from "@/components/search/discoveryArea";
import SearchTopLines from "@/components/search/SearchTopLines";
import SearchApp from "@/components/search/SearchApp";

interface SearchPageProps {
  schema: SchemaObject;
}

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  let schema = await getSchema();
  return {
    props: {
      schema,
    },
  };
};

const Search: NextPage<SearchPageProps> = ({ schema }) => {
  return (
    <SearchApp enableHistorySync={true}>
      <Header title={"Data Discovery"} />
      <NavBar />
      <SearchTopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          <DiscoveryArea schema={schema} />
        </div>
      </div>
      <Footer />
    </SearchApp>
  );
};

export default Search;
