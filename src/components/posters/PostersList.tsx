import React, {useState} from "react";
import type { PostersContent } from "../../lib/posters";
import PostersItem from "./PostersItem";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {BsGrid3X3GapFill, BsList} from "react-icons/bs";
import {Divider} from "@mui/material";

type Props = {
  posters: PostersContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostersList({ posters, pagination }: Props) {
  const [poster, setPoster] = useState(undefined);
  //const [tag, setTag] = useState(undefined);
  //const tags = [...new Set(posters?.flatMap(p => p?.tags))];
  const [view, setView] = useState('grid');

  return (
    <>
      <div className={"post-list"}>
        <Grid container spacing={2} alignItems={'center'} justifyContent={'space-between'} marginBottom={'2rem'}>
          {/* Future: Separate posters for different events using Tags */}
          {/*<ButtonGroup variant="outlined" aria-label="Basic button group">*/}
          {/*  {*/}
          {/*    tags?.map((t, index) =>*/}
          {/*      <Button size={'small'} style={{color:'#7e1cc4'}} color={'secondary'} key={`tag-${index}`} onClick={() => setTag(t)}>{t}</Button>*/}
          {/*    )*/}
          {/*  }*/}
          {/*</ButtonGroup>*/}

          {/* Toggle between Grid vs List view */}
          <ButtonGroup aria-label="Grid or List View">
            <Button color={'secondary'}
                    onClick={() => setView('grid')}
                    aria-label={'Grid view'}
                    style={{
                      border: '1px solid #7e1cc4',
                      color: view === 'grid' ? 'white' : '#7e1cc4',
                      backgroundColor: view === 'grid' ? '#7e1cc4' : 'white',
                    }}>
              <BsGrid3X3GapFill />
            </Button>
            <Button color={'secondary'}
                    onClick={() => setView('list')}
                    aria-label={'List view'}
                    style={{
                      border: '1px solid #7e1cc4',
                      color: view === 'list' ? 'white' : '#7e1cc4',
                      backgroundColor: view === 'list' ? '#7e1cc4' : 'white',
                    }}>
              <BsList />
            </Button>
          </ButtonGroup>
        </Grid>

        {/* Grid view: ImageList - more concise/clean, but hides author info behind a manual click */}
        {view === 'grid' && <Grid container spacing={15} alignItems={'center'}>
          <Grid size={6}>
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
                    draggable="false"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <Grid size={6} borderLeft={'2px dotted #7e1cc4'} height={'100%'} paddingTop={'2rem'} paddingLeft={'2rem'}>
            {
              poster && <PostersItem item={poster}></PostersItem>
            }
            {
              !poster && <Grid container justifyContent={'center'} alignItems={'center'}>
                Choose a poster to learn more
              </Grid>
            }
          </Grid>
        </Grid>}

        {/* List view: more closely matches our styles, but feels wordy */}
        {view === 'list' && <Grid container spacing={2}>
          {/* TODO - filter by tag: .filter(p => !tag || p.tags?.includes(tag))? */}
          {posters?.map((it, i) =>
            <Grid key={`poster-${i}`} size={12}>
              <PostersItem item={it} />
            </Grid>
          )}
        </Grid>}
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
