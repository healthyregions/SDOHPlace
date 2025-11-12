import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { WebSite, Organization } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import { ServerStyleSheets } from "@mui/styles";
import config from "@/lib/config";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta property="og:site_name" content={config.site_title} />
            {/* Some site-wide JSON-LD entries */}
            <script
                {...jsonLdScriptProps<WebSite>({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: config.site_title,
                    url: config.base_url
                })}
            />
            <script
                {...jsonLdScriptProps<Organization>({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Healthy Regions and Policies Lab",
                    url: "https://healthyregions.org",
                    logo: "https://healthyregionsorg.wordpress.com/wp-content/uploads/2022/08/herop_dark_logo_teal.png",
                    contactPoint: {
                        "@type": "ContactPoint",
                        email: "mkolak@illinois.edu",
                    }
                })}
            />
            {/* extra Plausible tag for custom events */}
            <script
                defer
                data-domain="sdohplace.org"
                src="https://plausible.io/js/script.pageview-props.tagged-events.js"
            ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
