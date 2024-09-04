"use client";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import { useState, useEffect } from "react";
import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { getSchema, SchemaObject } from "@/components/search/helper/GetSchema";
import Footer from "@/components/homepage/footer";
import { SearchUIConfig } from "@/components/searchUIConfig";
import DiscoveryArea from "@/components/search/discoveryArea";
import SearchTopLines from "@/components/search/SearchTopLines";

const solrUrl = process.env.NEXT_PUBLIC_SOLR_URL;
interface SearchPageProps {
  schema: SchemaObject;
}

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  let schema = getSchema();
  return {
    props: {
      schema,
    },
  };
};

const Search: NextPage<SearchPageProps> = ({ schema }) => {
  const [solrObjectResults, setSolrObjectResults] = useState(
    [] as SolrObject[]
  );
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetch(solrUrl + "/select?q=*:*&rows=100")
      .then((res) => res.json())
      .then((data) => {
        const solrObjectResults = data.response.docs.map((doc) =>
          initSolrObject(doc, schema)
        );
        setSolrObjectResults(solrObjectResults);
        setLoading(false);
      });
  }, [solrUrl, schema]);
  return (
    <>
      <NavBar />
      <SearchTopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          <DiscoveryArea
            results={solrObjectResults}
            isLoading={isLoading}
            filterAttributeList={SearchUIConfig.search.searchFilters.filters}
            schema={schema}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
