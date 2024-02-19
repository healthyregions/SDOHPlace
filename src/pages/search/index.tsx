"use client";
import type { NextPage } from "next";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import TopLines from "@/components/TopLines";
import { SearchResults} from "@/components/SearchResults";

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

interface SearchPageProps {
	results: SearchResults[];
}

const fetchResults = async function (url) {
	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}
	console.log(res);
	let results = res.json();
	return results;
};

// export default async function Page() {
//   // Initiate both requests in parallel
//   // const artistData = fetchResults("http://localhost:8983/solr/blacklight-core/select?q=*:*")

//   // Wait for the promises to resolve
//   const results = await fetchResults("http://localhost:8983/solr/blacklight-core/select?q=*:*")
//   console.log(results)
//   return (
//     <>
//       <h1>asrg</h1>
//       {/* {results.response.docs} */}
//     </>
//   )
// }

const Search: NextPage = () => {
	// let data = getResults()
	// console.log('asdfafdom3333')
	// console.log(data)
	// console.log('asdfafdom')
	// const teamList = [];
	// Object.keys(people).map(function (id, keyIndex) {
	//   const item = people[id];
	//   item.id = id;
	//   if (item.category.indexOf("core") >= 0) {
	//     teamList.push(item);
	//   }
	// });
	const [open, setOpen] = React.useState(true);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [data, setData] = useState(null);
	const [solrObjectResults, setSolrObjectResults] = useState([] as SolrObject[]);
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
							modal something
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
						modal something
					</div>
					<div className="bg-orange-300 w-full h-1 mt-10" />
				</Box>
			</Modal>
			<div className="flex flex-col">
				<div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
					<h1 className="font-fredoka">Data Discovery</h1>
					<Grid container mt={4}>
						<Grid item xs={6}>
							<SearchArea results={solrObjectResults}/>
						</Grid>
						<Grid item xs={6}>
							<h3>All Item List</h3>
							{data.response.docs.map((doc, index) => (
								<div
									key={index}
									className="text-lg font-medium leading-[177.778%] mt-2.5"
								>
									{doc.dct_title_s}
								</div>
							))}
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
};

export default Search;
