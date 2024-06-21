import createEmotionCache from "@/config/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProps as NextAppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "./Layout";
import Protected from "./Protected";

import "./tasks/[taskId]/page.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

interface AppProps extends NextAppProps {
  emotionCache: EmotionCache;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { session, ...otherPageProps } = pageProps;
  // type conversion to silence the error
  const getLayout: (page: React.ReactElement) => React.ReactNode =
    Component.getLayout || ((page) => page);

  const ComponentWithLayout = getLayout(<Component {...otherPageProps} />);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`Crossfit Vision`}</title>
      </Head>
      <SessionProvider session={session}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {Component.public ? (
              ComponentWithLayout
            ) : (
              <Protected>{ComponentWithLayout}</Protected>
            )}
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
