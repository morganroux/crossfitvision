import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { CssBaseline } from "@mui/material";
import NextAuthProvider from "@/components/NextAuthProvider";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crossfit Vision",
  description: "The first AI-powered fitness judge for competitive sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <NextAuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </NextAuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
