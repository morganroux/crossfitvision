"use client";

import background from "../../public/pexels-2261477.jpg";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import _ from "lodash";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { auth } from "./api/auth/[...nextauth]";

const IndexPage = () => {
  const router = useRouter();
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 8,
        paddingTop: 4,
        "::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 100%)",
          zIndex: 1,
        },
      }}
    >
      <Image
        priority
        src={background}
        alt="crossfit workout"
        fill={true}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
      />
      <Typography
        variant="h1"
        textAlign="center"
        sx={{ zIndex: 2, position: "relative" }}
      >
        crossfit vision
      </Typography>

      <Container sx={{ position: "relative", zIndex: 2 }}>
        <Stack alignItems="center">
          <Box sx={{ my: 4 }} />
          <Button onClick={() => router.push("/dashboard")} variant="contained">
            Sign in
          </Button>
        </Stack>
      </Container>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
  locale,
  locales,
  defaultLocale,
}) => {
  // if (eventCopilotConfig.env === "development") {
  //   await i18n?.reloadResources();
  // }
  const callbackUrl = query.callbackUrl as string;
  const session = await auth(req, res);
  if (session)
    return {
      redirect: {
        destination: callbackUrl ?? "/dashboard",
        permanent: false,
      },
    };
  else {
    return {
      props: {
        // ...(await serverSideTranslations(locale ?? defaultLocale ?? "fr", [
        //   "common",
        // ])),
        // Will be passed to the page component as props
      },
    };
  }
};

IndexPage.public = true;
export default IndexPage;
