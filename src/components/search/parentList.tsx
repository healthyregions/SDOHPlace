import * as React from "react";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // can be replaced by our svg icon
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { Divider, List, ListItem } from "@mui/material";
import { SolrObject } from "meta/interface/SolrObject";

const recordDetailStyle = {
  height: "calc(100% - 172px)",
  top: 172,
  padding: "25px",
};

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
  const [selectedRecord, setSelectedRecord] = React.useState<SolrObject | null>(
    null
  );
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      setSelectedRecord(
        selectedRecord && selectedRecord.id === panel
          ? null
          : solrParents.filter((obj) => {
              return obj.id === panel;
            })[0]
      );
    };

  if (solrParents)
    return (
      <>
        <h3>Results</h3>
        {solrParents.length === 0 ? (
          <div>No results</div>
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
                <AccordionDetails style={{ marginRight: "100px" }}>
                  {solrParent.index_year.join(", ")}
                  <Button onClick={toggleDrawer(true)}>More Info</Button>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
        <Drawer
          open={open}
          PaperProps={{ sx: recordDetailStyle }}
          onClose={toggleDrawer(false)}
          anchor={"bottom"}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleDrawer(false)}
          >
            Back to Results
          </Button>
          <h3>{selectedRecord && selectedRecord.title}</h3>
          {selectedRecord &&
            filterAttributeList.map((filter, index) =>
              selectedRecord[filter.attribute] ? (
                <List key={index}>
                  <ListItem>
                    {filter.displayName}:{" "}
                    {selectedRecord[filter.attribute].join(", ")}
                  </ListItem>
                </List>
              ) : selectedRecord.meta[filter.attribute] ? (
                <List key={index}>
                  <ListItem>
                    {filter.displayName}:{" "}
                    {typeof selectedRecord.meta[filter.attribute] === "string"
                      ? selectedRecord.meta[filter.attribute]
                      : (
                          selectedRecord.meta[filter.attribute] as string[]
                        ).join(", ")}
                  </ListItem>
                </List>
              ) : (
                <></>
              )
            )}
          {selectedRecord && (
            <Link
              href={"http://metadata.sdohplace.org/record/" + selectedRecord.id}
            >
              full record
            </Link>
            
          )}
          {
            selectedRecord && selectedRecord.meta["spatial_resolution"] && (
              // test only: show spacial resolution
            <List>
              <ListItem>
                Spatial Resolution: {selectedRecord.meta["spatial_resolution"]}
              </ListItem>
            </List>
            )
          }
        </Drawer>
      </>
    );
  else {
    return <div>Loading parent list...</div>;
  }
}
