import type {NextPage} from "next";

import BasicPageMeta from "@/components/meta/BasicPageMeta";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import Footer from "@/components/homepage/footer";
import * as React from "react";
import Alert from '@mui/material/Alert';
import Link from "next/link";
import {Button, List as MuiList, ListItem as MuiListItem} from "@mui/material";
import styled from "@emotion/styled";

const AccessDatasetsButton = styled(Button)`
  text-transform: 'none',
`;

const List = styled(MuiList)`
  list-style-type: disc;
`;

const ListItem = ({children}) =>
  <MuiListItem>
    <div>{children}</div>
  </MuiListItem>


const DataRefuge: NextPage = () => {
  return (
    <>
      <BasicPageMeta title={"Data Refuge"} />
      <NavBar />
      <TopLines />

      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 pb-[8rem] max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">SDOH Data Refuge</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl leading-[133.333%] w-[1068px] max-w-[1068px] max-md:max-w-full max-md:mt-10">
                  <div style={{ marginBottom: "10px" }}>

                    <div className={'mb-4'}>
                      In early 2025, there was a widespread effort to remove crucial federal public health
                      datasets in the United States. As researchers, community leaders, and scholars, this
                      has a significant impact on all of our work.
                    </div>

                    <div className={'mb-4'}>
                      Fortunately, the SDOH & Place Project team had already earmarked, indexed, and
                      identified critical datasets pertinent to measuring the structural drivers of
                      health in the year prior.
                    </div>

                    <div className={'mb-4'}>
                      When the Great Purge began, the team extracted multiple datasets at risk of being lost,
                      in collaboration with colleagues across the state of Illinois, and has since
                      linked multiple datasets to the SDOH Search Discovery Platform. The University of
                      Chicago Library team, as an early collaborator, developed additional metadata for
                      the data, and colleagues from a central Illinois health system further supported
                      efforts by identifying and downloading critical measures.
                    </div>
                    <div className={'mb-4'}>
                      The SDOH Data Refuge includes multiple datasets & guides from:
                      <List>
                        <ListItem>The Center for Disease Control (CDC), including the Social Vulnerability Index for all time periods and spatial scales</ListItem>
                        <ListItem>The Environmental Protection Agency (EPA), including EJScreen and EJ Index measures.</ListItem>
                        <ListItem>The Health Resources and Services Administration (HRSA)</ListItem>
                      </List>
                    </div>

                    <Alert severity="info" className={'mb-4'}>
                      <div className={"text-xl"}>
                        You can access the datasets and download files to your own computer using our
                        public Box link here:
                      </div>
                      <Link href={'https://go.illinois.edu/SDOH-Data-Refuge'}>
                        <AccessDatasetsButton variant="contained" color="primary">
                          Access Recovered Datasets
                        </AccessDatasetsButton>
                      </Link>

                      <div className={"mt-4"}>Data uploads are time-stamped.</div>
                    </Alert>

                    <div className={'mb-4'}>
                      Alternatively, you can search for the dataset of interest on the
                      {" "}<Link href={'/search'}>SDOH Discovery</Link>{" "}
                      platform, and find a link to the archive with additional
                      documentation made available, when available.
                    </div>

                    <div className={'mb-4'}>
                      Our current approach to identifying, organizing, and sharing previously publicly-available
                      SDOH data across federal systems is informed as researchers who regularly use the data
                      for analyses. Thus on the Box site, screenshots of webpages are preserved in many
                      cases as are technical documentations, when available and accessible. We know that
                      data means more with context, so linking the metadata and related documents is crucial
                      to the work.
                    </div>

                    <div className={'mb-4'}>
                      We also integrated resources and archives pulled from other teams across the country, including:
                      <List>
                        <ListItem>
                          <div>
                            CDC guidelines and prevention resources from{" "}
                            <Link href={'https://jessica.substack.com/p/cdc-birth-control-guidelines-pdf'}
                               target={'_blank'} rel={'noreferrer noopener'}>
                              Jessica Valenti’s
                            </Link>
                            {" "}team
                          </div>
                        </ListItem>
                        <ListItem>
                          Environmental Justice Index measurements archived by the{" "}
                          <Link target={'_blank'} href={'https://envirodatagov.org'} rel={'noreferrer noopener'}>
                            Environmental Data & Government Initiative
                          </Link>
                        </ListItem>
                        <ListItem>
                          <div>
                            A full PDF list of datasets available from{" "}
                          <Link target={'_blank'} href={'http://archive.org'} rel={'noreferrer noopener'}>
                            archive.org
                          </Link>.
                          If we don’t have what you’re looking for, and/or if you already know the specific CSV you need,
                          click on the data to download directly from the PDF.
                          </div>
                        </ListItem>
                      </List>
                    </div>

                    <div className={'mb-4'}>
                      We are grateful to additional feedback and guidance we received from
                      colleagues at the University of Illinois at Urbana-Champaign, the
                      National Center for Supercomputing Applications, and
                      Brown University’s School of Public Health.
                    </div>

                    <div className={'mb-4'}>
                      Finally, we are incredibly grateful to the
                      Robert Wood Johnson Foundation for their support
                      of the SDOH & Place project, and their commitment to advancing
                      health for all populations. In January 2025, they renewed their promise (link).
                      Additionally, we are grateful to the State of Illinois for serving as
                      a refuge for research and innovations in public health for all peoples.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DataRefuge;
