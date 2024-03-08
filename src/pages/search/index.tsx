"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { Grid } from "@mui/material";
import SearchArea from "@/components/search/searchArea";
import MapArea from "@/components/map/mapArea";
import { initSolrObject } from "meta/helper/solrObjects";
import { SolrObject } from "meta/interface/SolrObject";

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

const Search: NextPage = () => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [solrObjectResults, setSolrObjectResults] = useState(
    [] as SolrObject[]
  );
  const [isLoading, setLoading] = useState(true);
  const [allSchema, setAllSchema] = useState({});

  useEffect(() => {
    fetch(solrUrl + "/select?q=*:*&rows=100")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        fetch("/api/schema")
          .then((response) => response.json())
          .then((schemaData) => {
            setAllSchema(schemaData);
            const solrObjectResults = [];
            data.response.docs.map((doc, index) => {
              solrObjectResults.push(initSolrObject(doc, schemaData));
            });
            setSolrObjectResults(solrObjectResults);
            setLoading(false);
          })
          .catch((error) => console.error("Error fetching metadata:", error));
      });
  }, []);

  return (
    <>
      <Header title={"Data Discovery"} />
      <NavBar />
      <TopLines />
      {/* <Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalBoxStyle}>
					<div>How to Search</div>
					<div className="bg-orange-300 clear-both max-w-[1068px] h-1 max-md:max-w-full max-h-full" />
					<div className="self-center w-full mt-10 max-md:max-w-full">
						modal something
					</div>
					<div className="bg-orange-300 w-full h-1 mt-10" />
				</Box>
			</Modal> */}
      <div className="flex flex-col">
        <div className="self-center flex w-full 2xl:max-w-[1536px] flex-col max-md:max-w-full mt-[100px] pl-[2.5%]">
          <h1 style={{ fontSize: "3em" }}>Data Discovery</h1>
        </div>
        <div className="self-center flex w-full flex-col max-md:max-w-full">
          <Grid container height={"calc(100vh - 172px)"}>
            <Grid item height={"100%"} sx={{ overflow: "scroll" }} xs={3}>
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
                    // Temporarily removed Place, will develop a special way to handle this
                    // {
                    // 	attribute: "spatial_coverage",
                    // 	displayName: "Place",
                    // },
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
                    {
                      attribute: "spatial_resolution",
                      displayName: "Spatial Resolution",
                    },
                    {
                      attribute: "methods_variables",
                      displayName: "Methods Variables",
                    },
                    {
                      attribute: "data_variables",
                      displayName: "Data Variables",
                    },
                  ]}
                  schema={allSchema}
                />
              )}
            </Grid>
            <Grid item xs={9}>
              <MapArea />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Search;
