"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import TopLines from "@/components/TopLines";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { Grid } from "@mui/material";
import SearchArea from "@/components/search/searchArea";
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
  const [solrObjectResults, setSolrObjectResults] = useState(
    [] as SolrObject[]
  );
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(solrUrl + "/select?q=*:*&rows=100")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log("rawSolr ", data.response.docs);
        const solrObjectResults = [];
        data.response.docs.map((doc, index) => {
          solrObjectResults.push(initSolrObject(doc));
        });
        setSolrObjectResults(solrObjectResults);
        setLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <>
        <Header title={"Data Discovery"} />
        <NavBar />
        <TopLines />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalBoxStyle}>
            <div>How to Search</div>
            <div className="bg-orange-300 clear-both max-w-[1068px] h-1 max-md:max-w-full max-h-full" />
            <div className="self-center w-full mt-10 max-md:max-w-full">
              page loading...
            </div>
            <div className="bg-orange-300 w-full h-1 mt-10" />
          </Box>
        </Modal>
        <div className="flex flex-col">Loading...</div>
      </>
    );
  if (!data) return <p>No profile data</p>;

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
        <div className="self-center flex w-full flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">Data Discovery</h1>
          <Grid container mt={4}>
            <Grid item xs={12}>
              <SearchArea
                results={solrObjectResults}
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
              />
            </Grid>
            {/* <Grid item xs={6}>
							<h3>All Item List</h3>
							{data.response.docs.map((doc, index) => (
								<div
									key={index}
									className="text-lg font-medium leading-[177.778%] mt-2.5"
								>
									{doc.dct_title_s}
								</div>
							))}
						</Grid> */}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Search;
