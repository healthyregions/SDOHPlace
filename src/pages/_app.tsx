import "../styles/globals.css";
import * as React from "react";
import { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";
import { Provider } from "react-redux";
import { store } from "@/store";
import PlausibleProvider from 'next-plausible';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const AnyComponent = Component as any;

  return (
    <>
      <PlausibleProvider domain="sdohplace.org">
        <CacheProvider value={emotionCache}>
          <Provider store={store}>
            <AnyComponent {...pageProps} />
          </Provider>
        </CacheProvider>
      </PlausibleProvider>
    </>
  );
}
