import * as React from "react";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // can be replaced by our svg icon
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Divider, List, ListItem } from "@mui/material";
import { SolrObject } from "meta/interface/SolrObject";

export default function ParentList({
	solrParents,
	filterAttributeList,
}: {
	solrParents: SolrObject[];
	filterAttributeList: {
		attribute: string;
		displayName: string;
	}[];
}): JSX.Element {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	if (solrParents)
		return (
			<div>
				<h3>Parent List</h3>
				{solrParents.length === 0 ? (
					<div>No parent found</div>
				) : (
					solrParents.map((solrParent, index) => {
						return (
							<Accordion
								key={index}
								expanded={expanded === solrParent.id}
								onChange={handleChange(solrParent.id)}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`${solrParent.id}bh-content`}
									id={`${solrParent.id}bh-header`}
								>
									<Typography sx={{ color: "text.primary" }}>
										{solrParent.title}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{filterAttributeList.map((filter, index) =>
										solrParent[filter.attribute] ? (
											<List key={index}>
												<ListItem>
													{filter.displayName}:{" "}
													{solrParent[
														filter.attribute
													].join(", ")}
												</ListItem>
											</List>
										) : solrParent.meta[
												filter.attribute
										  ] ? (
											<List key={index}>
												<ListItem>
													{filter.displayName}:{" "}
													{typeof solrParent.meta[
														filter.attribute
													] === "string"
														? solrParent.meta[
																filter.attribute
														  ]
														: (
																solrParent.meta[
																	filter
																		.attribute
																] as string[]
														  ).join(", ")}
												</ListItem>
											</List>
										) : (
											<></>
										)
									)}
								</AccordionDetails>
							</Accordion>
						);
					})
				)}
			</div>
		);
	else {
		return <div>Loading parent list...</div>;
	}
}
