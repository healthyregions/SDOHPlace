"use client";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { usePathname, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import SearchArea from "@/components/search/searchArea";
import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";
import { getSchema, SchemaObject } from "@/components/search/helper/GetSchema";
import { updateSearchParams } from "@/components/search/helper/ManageURLParams";

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

  // create a useState variable that will mirror our param value and
  // can be used locally here
  const [exampleInput, setExampleInput] = useState(null);

  // these varables must be created here so they can be passed into
  // updateSearchParams() within hooks that come later
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();

  // handler function that pushes values from the input into a url param
  const handleExampleInput = (value: string) => {
    updateSearchParams(
      router,
      searchParams,
      currentPath,
      "example-input",
      value,
      "overwrite"
    );
  };

  // first hook to update the reactive variable, exampleInput
  useEffect(() => {
    const newExampleInput = searchParams.get("example-input");
    if (newExampleInput && newExampleInput != exampleInput) {
      setExampleInput(newExampleInput);
    }
  }, [searchParams, exampleInput]);

  // second hook to do things with this specific param only when it is changed
  useEffect(() => {
    console.log("example input:", exampleInput);
  }, [exampleInput]);

  useEffect(() => {
    fetch(solrUrl + "/select?q=*:*&rows=100")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        const solrObjectResults = [];
        data.response.docs.map((doc, index) => {
          solrObjectResults.push(initSolrObject(doc, schema));
        });
        setSolrObjectResults(solrObjectResults);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar />
      <TopLines />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <h2>How to Search</h2>
          <div className="bg-orange-300 clear-both max-w-[1068px] h-1 max-md:max-w-full max-h-full" />
          <div className="self-center w-full mt-10 max-md:max-w-full">
            This could be an introductory message/splash page. Or we could
            remove it.
          </div>
          <div>
            <p>
              Here is an example of an input that is mirrored in the url params:
            </p>
            <input
              style={{ color: "black" }}
              placeholder="test"
              onChange={(event) => handleExampleInput(event.target.value)}
              defaultValue={searchParams.get("example-input"?.toString()) || ""}
            />
          </div>
          <div className="bg-orange-300 w-full h-1 mt-10" />
        </Box>
      </Modal>
      <div className="flex flex-col">
        <div className="self-center flex w-full 2xl:max-w-[1536px] flex-col max-md:max-w-full mt-[100px] pl-[2.5%]">
          <h1 style={{ fontSize: "3em" }}>Data Discovery</h1>
        </div>
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <SearchArea
              results={solrObjectResults}
              isLoading={isLoading}
              filterAttributeList={[
                {
                  attribute: "index_year",
                  displayName: "Year",
                },
                {
                  attribute: "resource_class",
                  displayName: "Resource Class",
                },
                {
                  attribute: "resource_type",
                  displayName: "Resource Type",
                },
                {
                  attribute: "format",
                  displayName: "Format",
                },
                {
                  attribute: "subject",
                  displayName: "Subject",
                },
                {
                  attribute: "theme",
                  displayName: "Theme",
                },
                {
                  attribute: "creator",
                  displayName: "Creator",
                },
                {
                  attribute: "publisher",
                  displayName: "Publisher",
                },
                {
                  attribute: "provider",
                  displayName: "Provider",
                },
                // Move the Spatial Resolution to the top as a distinct filter
                // {
                //   attribute: "spatial_resolution",
                //   displayName: "Spatial Resolution",
                // },
                {
                  attribute: "methods_variables",
                  displayName: "Methods Variables",
                },
                {
                  attribute: "data_variables",
                  displayName: "Data Variables",
                },
              ]}
              schema={schema}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
