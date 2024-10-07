import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";
import Footer from "./homepage/footer";
import React from "react";
import PostLayout, {PostLayoutProps} from './news/PostLayout';
import ShowcaseLayout, {ShowcaseLayoutProps} from './showcase/ShowcaseLayout';

type Props = {
  type?: 'news' | 'showcase' /* | 'guide' */;
  news_props?: PostLayoutProps;
  showcase_props?: ShowcaseLayoutProps;
  /*guide_props?: GuideLayoutProps;*/
  page_header?: string;
  children?: React.ReactNode;
};
export default function Layout({ type, news_props, showcase_props, page_header, children }: Props) {
  const getTitle = (type: string) => {
    switch (type) {
      case 'news':
        return 'News';
      case 'showcase':
        return 'Showcase';
      /*case 'guides':
        return 'Guides';*/
      default:
        return undefined;
    }
  }

  return (
    <>
      <Header title={getTitle(type)} />
      <NavBar />
      <TopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full max-w-[1068px] flex-col px-5 max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka">{page_header}</h1>
          <div className="self-center w-full mt-10 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              { !type && <main>{children}</main> }
              { type === 'news' && <PostLayout {...news_props}>{news_props.children}</PostLayout> }
              { type === 'showcase' && <ShowcaseLayout {...showcase_props}>{showcase_props.children}</ShowcaseLayout> }
              {/*type === 'guide' && <GuideLayout {...guide_props}></GuideLayout>*/}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>
        {`
          .root {
            display: block;
            padding: 4rem 0;
            box-sizing: border-box;
            height: 100%;
          }
          main {
            display: flex;
            min-height: 100%;
          }
          @media (min-width: 769px) {
            .root {
              display: flex;
              flex: 1 0 auto;
            }
            main {
              flex: 1 0 auto;
            }
          }
          
          .metadata div {
            display: inline-block;
            margin-right: 0.5rem;
          }
          article {
            flex: 1 0 auto;
          }
          h1 {
            margin: 0 0 0.5rem;
          }
          .backlink {
            color: grey;
            margin-bottom: 1em;
          }
          .tag-list {
            list-style: none;
            text-align: right;
            margin: 1.75rem 0 0 0;
            padding: 0;
          }
          .tag-list li {
            display: inline-block;
            margin-left: 0.5rem;
          }
          .social-list {
            margin-top: 3rem;
            text-align: center;
          }

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
            }
          }
        `}
      </style>
      <style global jsx>
        {`
          /* Syntax highlighting */
          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata,
          .token.plain-text {
            color: #6a737d;
          }

          .token.atrule,
          .token.attr-value,
          .token.keyword,
          .token.operator {
            color: #d73a49;
          }

          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #22863a;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #032f62;
          }

          .token.function,
          .token.class-name {
            color: #6f42c1;
          }

          /* language-specific */

          /* JSX */
          .language-jsx .token.punctuation,
          .language-jsx .token.tag .token.punctuation,
          .language-jsx .token.tag .token.script,
          .language-jsx .token.plain-text {
            color: #24292e;
          }

          .language-jsx .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-jsx .token.tag .token.class-name {
            color: #005cc5;
          }

          .language-jsx .token.tag .token.script-punctuation,
          .language-jsx .token.attr-value .token.punctuation:first-child {
            color: #d73a49;
          }

          .language-jsx .token.attr-value {
            color: #032f62;
          }

          .language-jsx span[class="comment"] {
            color: pink;
          }

          /* HTML */
          .language-html .token.tag .token.punctuation {
            color: #24292e;
          }

          .language-html .token.tag .token.attr-name {
            color: #6f42c1;
          }

          .language-html .token.tag .token.attr-value,
          .language-html
            .token.tag
            .token.attr-value
            .token.punctuation:not(:first-child) {
            color: #032f62;
          }

          /* CSS */
          .language-css .token.selector {
            color: #6f42c1;
          }

          .language-css .token.property {
            color: #005cc5;
          }
        `}
      </style>
    </>
  );
}
