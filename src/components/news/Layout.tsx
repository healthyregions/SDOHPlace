import Head from "next/head";
import NavBar from "@/components/NavBar";
import TopLines from "@/components/TopLines";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    // <div className="root">
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <NavBar />
      <TopLines />
      <div className="flex flex-col">
        <div className="self-center flex w-full max-w-[1068px] flex-col max-md:max-w-full mt-[100px]">
          <h1 className="font-fredoka mb-5">Project News</h1>
        </div>
        <main>{children}</main>
      </div>
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
        `}
      </style>
    </>
  );
}
