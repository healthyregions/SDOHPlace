"use client";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { usePathname, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { getSchema, SchemaObject } from "@/components/search/helper/GetSchema";
import { updateSearchParams } from "@/components/search/helper/ManageURLParams";
import Footer from "@/components/homepage/footer";
import { SearchUIConfig } from "@/components/searchUIConfig";
import DiscoveryArea from "@/components/search/discoveryArea";
import SearchTopLines from "@/components/search/SearchTopLines";

const fullConfig = resolveConfig(tailwindConfig);

const solrUrl = process.env.NEXT_PUBLIC_SOLR_URL;

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1068px",
  maxHeight: "100vh",
  color: "white",
  bgcolor: `${fullConfig.theme.colors["darkgray"]}`,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  paddingTop: "10px",
  overflowY: "auto",
};
const sideBarStyle = {};

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
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = useState(null);
  const [allResults, setAllResults] = useState([]);
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
  const memoizedSolrObjectResults = useMemo(
    () => solrObjectResults,
    [solrObjectResults]
  );
  return (
    <>
      <NavBar />
      <SearchTopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <DiscoveryArea
              results={solrObjectResults}
              isLoading={isLoading}
              filterAttributeList={SearchUIConfig.search.searchFilters.filters}
              schema={schema}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
