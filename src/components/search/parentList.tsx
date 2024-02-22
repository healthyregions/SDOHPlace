import * as React from "react";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // can be replaced by our svg icon
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SolrParent } from "../../../meta/interface/SolrParent";
import { Divider, List, ListItem } from "@mui/material";

export default function ParentList({
	solrParents,
}: {
	solrParents: SolrParent[];
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
								key={solrParent.id}
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
									<List>
										<ListItem>
											Created by: {solrParent.creator}
										</ListItem>
										<ListItem>
											Description:{" "}
											{solrParent.description}
										</ListItem>
										<ListItem>
											Year:{" "}
											{Array.from(solrParent.year).join(
												", "
											)}
										</ListItem>
										<ListItem>
											Years:{" "}
											{Array.from(solrParent.years).join(
												", "
											)}
										</ListItem>
									</List>
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
