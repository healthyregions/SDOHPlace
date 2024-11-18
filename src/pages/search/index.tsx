"use client";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import { useQueryStates } from 'nuqs';
import { useState, useEffect } from "react";
import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { getSchema, SchemaObject } from "@/components/search/helper/GetSchema";
import Footer from "@/components/homepage/footer";
import {
  GetAllParams,
  reGetFilterQueries,
} from "@/components/search/helper/ParameterList";
import SolrQueryBuilder from "@/components/search/helper/SolrQueryBuilder";
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
  const params = GetAllParams();
  const filterQueries = reGetFilterQueries(params);
  const initialQueryBuilder = new SolrQueryBuilder();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const filterQ = initialQueryBuilder.filterQuery(filterQueries).getQuery();
  //     console.log("FilterQ: ", filterQ);
  //     try {
  //       const response = await fetch(filterQ);
  //       const data = await response.json();
  //       const solrObjectResults = data.response.docs.map((doc: any) =>
  //         initSolrObject(doc, schema)
  //       );
  //       setSolrObjectResults(solrObjectResults);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // },[schema]);
  return (
    <>
      <NavBar />
      <SearchTopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          <DiscoveryArea schema={schema} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
