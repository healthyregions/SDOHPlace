import React from "react";
import ShowcaseItem from "./ShowcaseItem";
import Pagination from "../news/Pagination";
import Grid from "@mui/material/GridLegacy";
import Link from "next/link";
import styled from "@emotion/styled";
import TagLink from "@/components/news/TagLink";
import { ShowcaseContent } from "@/lib/showcases";
import {TagContent} from "@/lib/tags";

type Props = {
  showcases: ShowcaseContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
const StyledGrid = styled(Grid)`
  font-size: 20px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const TagsList = ({ tags }) => <div className={' my-4 flex flex-col'}>
  <strong>Tags</strong>
  {/* Mobile: Display tags as a horizontal row  */}
  {/* Desktop: Display tags as a vertical list  */}
  <ul className={"flex flex-col max-md:flex-row"}>
    {tags.map((it, i) => (
      <li key={i} className={'mr-8'}>
        <TagLink tag={it} prefix={'/showcase/tags'} />
      </li>
    ))}
  </ul>
</div>;
export default function ShowcaseList({ showcases, pagination, tags }: Props) {
  return (
    <>
      <div className={"post-list"}>
        <Grid container spacing={0} className={'mb-12 flex flex-grow-1'}>
          <StyledGrid item xs={12} md={10}>
            Below are some of the impactful social determinants of health (SDOH)
            place-based data visualizations developed by our{" "}<StyledLink href={'/fellows'}>SDOH & Place Fellows</StyledLink>.
            To learn how to create your own, access our{" "}<StyledLink href={'https://toolkit.sdohplace.org/'}>Community Toolkit</StyledLink>.
          </StyledGrid>

          <Grid item xs={12} md={2}>
            <TagsList tags={tags}></TagsList>
          </Grid>
        </Grid>

        <ul className={""}>
          {showcases.map((it, i) => (
            <li key={i}>
              <ShowcaseItem item={it} />
            </li>
          ))}
        </ul>
        {/* <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? "/news" : "/news/page/[page]"),
            as: (page) => (page === 1 ? null : "/news/page/" + page),
          }}
        /> */}
      </div>
    </>
  );
}
