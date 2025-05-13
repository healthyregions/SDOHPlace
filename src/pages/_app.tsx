import "../styles/globals.css";
import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";
import { Provider } from "react-redux";
import { store } from "@/store";
import PlausibleProvider from 'next-plausible';
import HistorySyncController from "@/components/search/HistorySyncController";
import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const AnyComponent = Component as any;
  const router = useRouter();
  const isSearchPage = router.pathname.startsWith('/search');
  const fixHistoryStackForSearch = useCallback(() => {
    if (typeof window === 'undefined' || !router.isReady) return;
    
    if (isSearchPage && window.location.search && window.history.length <= 1) {
      try {
        const currentUrl = window.location.pathname + window.location.search;
        window.history.replaceState(
          { path: currentUrl, timestamp: Date.now(), replaced: true },
          "",
          currentUrl
        );
        window.history.pushState(
          { path: '/search', timestamp: Date.now() - 1000, isInitial: true },
          "",
          '/search'
        );
        window.history.pushState(
          { path: currentUrl, timestamp: Date.now(), hasParams: true },
          "",
          currentUrl
        );
      } catch (error) {
        console.error('Error fixing history stack for search page', error);
      }
    }
  }, [router.isReady, isSearchPage]);
  useEffect(() => {
    fixHistoryStackForSearch();
  }, [router.isReady, isSearchPage, router.pathname, fixHistoryStackForSearch]);
  const useAppLevelHistorySync = true;
  return (
    <>
      <PlausibleProvider domain="sdohplace.org">
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <Provider store={store}>
            {isSearchPage && useAppLevelHistorySync && <HistorySyncController enabled={true} />}
            <AnyComponent {...pageProps} />
          </Provider>
        </CacheProvider>
      </PlausibleProvider>
    </>
  );
}
