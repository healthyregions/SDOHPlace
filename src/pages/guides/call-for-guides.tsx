import { GetStaticProps } from "next";
import BasicPageMeta from "@/components/meta/BasicPageMeta";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import config from "@/lib/config";
import {
  countGuides,
  listGuidesContent,
} from "@/lib/guides";
import { listNewsTags } from "@/lib/tags";
import Link from "next/link";
import styled from "@emotion/styled";
import {List as MuiList, ListItem as MuiListItem} from "@mui/material";
import Footer from "@/components/homepage/footer";
import React from "react";

const Paragraph = styled.div`
  a { color: #7E1CC4; text-decoration: none }
  strong { font-weight: 700; }
`;
const NumberedList = styled.ol`
  list-style: decimal;
`;
const List = styled(MuiList)`
  list-style: disc;
`;
const ListItem = styled(MuiListItem)`
  display: list-item;
  margin-left: 2rem;
  padding-left: 0;
  strong { font-weight: 700 }
  ::marker { color: #FF9C77; }
`;

export default function Index() {
  return (
    <>
      <BasicPageMeta title='Call for SDOH Measurement "Research Guide" Reports' />
      <NavBar />
      <TopLines />
      <div className="flex flex-col pt-12">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka" style={{fontSize:'3.5rem', lineHeight:'5.25rem'}}>Call for SDOH Measurement &quot;Research Guide&quot; Reports</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[92%] max-md:w-full max-md:ml-0">
                <div className="text-stone-900 text-xl max-md:max-w-full max-md:mt-10 mb-16">
                  <Paragraph>
                    <List>
                      <ListItem><strong>Generate a public-friendly short report</strong> on the measurement of a specific social determinant of health topic for a national RWJF project: SDOH & Place.</ListItem>
                      <ListItem>Potential to expand your report with an expert in your field to a manuscript, leveraging access to a <strong>network of scholars</strong> studying Community-Level SDOH</ListItem>
                      <ListItem>U.S.-based scholars & residents participating in writing and/or reviewing Research Guides are eligible for <strong>compensation</strong> for their time ($100-$300).</ListItem>
                    </List>
                  </Paragraph>

                  <br />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={'/images/call-for-guides-1.png'} alt={'Building Consensus & Community'} />
                  <br />
                  <br />

                  <h3>Research Guide Specifications</h3>
                  <Paragraph>
                    Research guides focus on a distinct measure of a social determinant
                    of health / structural driver of health. For example,{" "}
                    <i>transit equity</i>, <i>greenspace</i>, or <i>gentrification</i>{" "}
                    may be topics of interest that are associated with health outcomes
                    in complex ways. Before researchers can analyze and interrogate those
                    pathways, the constructs themselves must be identified as distinct measures.
                    Research guides provide an overview of goals, motivations, and best
                    practices of measurement for the indicator of interest.
                  </Paragraph>
                  <br />
                  <Paragraph>
                    We are seeking SDOH & Place Research Guide topic proposals and paid
                    final contributions for guide composition. The guides for a specific
                    measure of interest should be:

                    <List>
                      <ListItem>A distinct indicator viewed as a SDOH and/or structural driver of health, that has a known association, impact, and/or relationship with health outcomes.</ListItem>
                      <ListItem>Focused on <i>community-level</i> measures, rather than individual, to address the contextual aspects of SDOH. How might the measure be estimated at tract, zip code, or county levels?</ListItem>
                      <ListItem>Grouped within one primary sub-category: demographics, economic stability, employment, education, food environment, health and healthcare, housing, neighborhood and built environment, physical activity and lifestyle, safety, social and community context, and transportation and infrastructure</ListItem>
                      <ListItem>Literature review-driven summary of best practices for measurement of indicator</ListItem>
                      <ListItem>Presented as a table of commonly used measures to represent indicator with varying levels of complexity (i.e. census proxy versus geocomputationally derived estimate or survey-driven response)</ListItem>
                      <ListItem>Written in a style appropriate for a multi- or trans-disciplinary audience, explaining jargon thoughtfully and in plain language</ListItem>
                      <ListItem>Offering a curated list of resources and evidence-based literature related to topic</ListItem>
                    </List>

                    Illustrations, (e.g. of models), tables, or occasionally bullet points are welcome to
                    make the guide less one very long text. <strong>To view a Research Guide example, see our
                    published Guides <Link href={'/guides'} target='_blank' rel='noopener noreferrer'>here</Link>!</strong>
                  </Paragraph>

                  <br />
                  <Link href={'/guides/public-transit-equity'} target='_blank' rel='noopener noreferrer'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={'/images/call-for-guides-2.png'} alt={'Review our First SDOH Guide for Inspiration'} />
                  </Link>
                  <br />
                  <br />

                  <h3>Application</h3>
                  <Paragraph>
                    Composing a research guide may be an excellent opportunity for geography,
                    social sciences, urban planning, and/or public health graduate students
                    mastering a specific topic of interest, as well as researchers or advocates
                    specializing in a topic crucial to SDOH research. We are also seeking
                    reviewers of research guides to enhance and validate content as masters
                    in their field; reviewers may be proposed by research guide authors,
                    and/or may submit interest for a topic separately. Authors and reviewer
                    teams will be encouraged to collaborate on updates together, and expand
                    as a full manuscript for submission to a peer-reviewed journal.
                  </Paragraph>
                  <br />
                  <Paragraph>
                    Authors of accepted SDOH Research Guides will receive a{" "}<strong>$300* flat-rate fee</strong>{" "}
                    for their guide; Reviewers will receive a{" "}<strong>$100* remuneration</strong>.
                  </Paragraph>
                  <br />
                  <Paragraph>
                    <small><i>*Remuneration & Fee Eligibility:</i>{" "}At this time, we are only
                      able to provide remuneration & fees for U.S. based scholars. See a complete
                      list of eligibility details{" "}
                      <Link href={'https://docs.google.com/document/d/1vlAkzcacCTqX6_UrqMTnDRduKLNE-moEA2PNA3LCYwo/edit?usp=sharing'} target='_blank' rel='noopener noreferrer'>here</Link>
                      . If you are an international scholar that is interested in participating and donating your time, please indicate in
                      the application.</small>
                  </Paragraph>
                  <br />
                  <Paragraph>
                    Application Procedure: To apply, please review the following:

                    <NumberedList>
                      <ListItem>Identify your topic of interest in accordance with guidelines above, and{" "}
                        <Link href={'https://docs.google.com/document/d/1341Dm8Edz3k2BJWBrexEUk2NEUKGYmldCSP4metWSFE/edit?usp=sharing'} target='_blank' rel='noopener noreferrer'>
                          ensure it is available
                        </Link>. You can also propose or refine specific calls for
                        indicators like <i>food access</i> or <i>gentrification</i>.
                      </ListItem>
                      <ListItem><strong>For Authors</strong>: Prepare a ~250 word abstract of your indicator of interest.</ListItem>
                      <ListItem><strong>For Reviewers</strong>: Prepare a ~250 word summary of your expertise for a specific SDOH topic.</ListItem>
                      <ListItem>Submit your application (including topic, abstract, curriculum vitae, and related details) using{" "}<Link href={'https://go.illinois.edu/SDOH-GUIDES-APPLY'}>this form</Link>{" "}(or click the button below).</ListItem>
                      <ListItem>If invited to submit a full SDOH Research Guide, your deadline for completion will be <strong>March 15, 2026</strong>. The flat-rate fees and remunerations will be disbursed upon completion of work.</ListItem>
                    </NumberedList>

                  </Paragraph>
                  <br />
                  <Paragraph>
                    Submit your application here:{" "}<Link href={'https://go.illinois.edu/SDOH-GUIDES-APPLY'} target='_blank' rel='noopener noreferrer'>https://go.illinois.edu/SDOH-GUIDES-APPLY</Link>
                  </Paragraph>

                  <br />
                  <Paragraph>
                    Application decisions will be communicated on a rolling basis. If you have any questions
                    or have not heard back within 2 weeks, please reach out to Research Guide Lead,
                    Catherine Discenza (<Link href={'mailto:cd43@illinois.edu'} target='_blank' rel='noopener noreferrer'>cd43@illinois.edu</Link>), and/or our Research Coordinator,
                    Marc Astacio-Palmer (<Link href={'mailto:mastacio@illinois.edu'} target='_blank' rel='noopener noreferrer'>mastacio@illinois.edu</Link>). Be sure to check the list of
                    accepted topics before submitting.
                  </Paragraph>

                  <br />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={'/images/call-for-guides-3.png'} alt={'Research Guide Topics Available'} />
                  <br />
                  <br />


                  <Paragraph>
                    Please reach out to the team with any questions you may have via the{" "}
                    <Link href={'/contact'} target='_blank' rel='noopener noreferrer'>SDOH & Place Contact Form</Link>, and/or directly messaging Research Coordinator
                    Marc Astacio-Palmer (<Link href={'mailto:mastacio@illinois.edu'} target='_blank' rel='noopener noreferrer'>mastacio@illinois.edu</Link>).
                  </Paragraph>
                </div>


              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const guides = listGuidesContent( 1, config.posts_per_page);
  const tags = listNewsTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countGuides() / config.posts_per_page),
  };
  return {
    props: {
      guides,
      tags,
      pagination,
    },
  };
};
