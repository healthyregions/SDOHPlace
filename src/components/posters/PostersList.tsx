import React, {useState} from "react";
import type { PostersContent } from "../../lib/posters";
import PostersItem from "./PostersItem";
import Pagination from "../news/Pagination";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Link from "next/link";
import GuidesList from "@/components/guides/GuidesList";
import styled from "@emotion/styled";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const TagsGroup = styled(ButtonGroup)`
    color: #7e1cc4;
`;

type Props = {
  posters: PostersContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostersList({ posters, pagination }: Props) {
  const [poster, setPoster] = useState(undefined);
  const [tag, setTag] = useState(undefined);
  const tags = [...new Set(posters?.flatMap(p => p?.tags))];



  return (
    <>
      <div className={"post-list"}>
        {/* Future: separate posters for different events using Tags */}
        {/*<Grid container spacing={2}>*/}
        {/*  <ButtonGroup variant="outlined" aria-label="Basic button group">*/}
        {/*    {*/}
        {/*      tags?.map((t, index) =>*/}
        {/*        <Button color={'secondary'} style={{ color: '#7e1cc4' }} key={`tag-${index}`} onClick={() => setTag(t)}>{t}</Button>*/}
        {/*      )*/}
        {/*    }*/}
        {/*  </ButtonGroup>*/}
        {/*</Grid>*/}

        {/* Option A: ImageList - more concise/clean, but hides author info behind a manual click */}
        <Grid container spacing={30}>
          <Grid size={{ xs: poster ? 6 : 12 }}>
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {posters.map((item, index) => (
                <ImageListItem key={`poster-image-${index}`}
                               style={{
                                 cursor:'pointer',
                                 border: poster === item ? 'dotted 2px #7e1cc4' : 'none',
                                 borderRadius: '12px',
                                 padding: '0.5rem'
                }}>
                  <img
                    onClick={() => setPoster(item)}
                    srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          {
            poster && <Grid size={{ xs: 6 }}>
              <PostersItem item={poster}></PostersItem>
            </Grid>
          }
        </Grid>

        {/* Option B: Manual Grid - more closely matches our styles, but feels wordy */}
        <Grid container spacing={2}>
          {posters?.filter(p => !tag || p.tags?.includes(tag))?.map((it, i) =>
            <Grid key={`poster-${i}`} size={{ xs: 12, md: 6 }}>
              <PostersItem item={it} />
            </Grid>
          )}
        </Grid>
        {/* <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: (page) => (page === 1 ? "/posters" : "/posters/page/[page]"),
            as: (page) => (page === 1 ? null : "/posters/page/" + page),
          }}
        /> */}
      </div>
    </>
  );
}
