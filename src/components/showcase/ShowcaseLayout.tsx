import React from "react";
import PostLayout, { PostLayoutProps } from "../news/PostLayout";

export default function ShowcaseLayout({
  title,
  date,
  image,
  link,
  slug,
  fellowName,
  techUsed,
  tags,
  description = "",
  children,
  showJsonLd = false,
  showMetadata = false,
  pathPrefix = '/showcase',
  backButtonText = 'Back to showcases',
}: PostLayoutProps) {
  return (
    <PostLayout title={title} image={image} link={link} slug={slug}
                date={date} fellowName={fellowName} techUsed={techUsed}
                tags={tags} description={description} showJsonLd={showJsonLd}
                showMetadata={showMetadata} pathPrefix={pathPrefix}
                backButtonText={backButtonText}
    >
        {children}
    </PostLayout>
  );
}
