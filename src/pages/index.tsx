import background from "../../public/pexels-2261477.jpg";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import _ from "lodash";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { auth } from "./api/auth/[...nextauth]";

const IndexPage = () => {
  const cards = [
    {
      title: "1. Onboard your participants",
      description:
        "Easily share a link where each participant can upload their video, or direclty import the ones they already sent to you.",
    },
    {
      title: "2. Let the AI do the heavy lifting",
      description:
        "Our software will automatically analyze each video, and provide a score based on the movement standards and your own rules.",
    },
    {
      title: "3. Keep the final word",
      description:
        "A dedicated dashboard will allow you to review each score, and the few videos the AI was unsure about are flagged.",
    },
  ];
  const router = useRouter();
  return (
    <Container maxWidth={false} disableGutters>
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
          sx={{
            zIndex: 2,
            position: "relative",
            background:
              "-webkit-linear-gradient(-45deg, rgba(234,21,6,1) 40%, rgba(237,44,5,1) 70%, rgba(245,96,0,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Functional AI
        </Typography>

        <Container
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
          }}
        >
          <Stack
            alignItems="center"
            flexDirection="column"
            sx={{ height: "100%", mt: 8 }}
          >
            {/* <Box sx={{ flex: 1 }} /> */}

            <Typography
              variant="h2"
              align="center"
              sx={{
                fontSize: {
                  xs: "3rem",
                  sm: "4rem",
                },
              }}
            >
              The first AI judge for CrossFit® competitions
            </Typography>
            <Box sx={{ my: 8 }} />
            <Stack
              gap={4}
              sx={{
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              <Button
                size="large"
                onClick={() =>
                  window &&
                  window.open("https://calendly.com/roux-morgan/30min")
                }
                variant="contained"
                color="inherit"
              >
                Book a demo
              </Button>
              <Button
                size="large"
                onClick={() => router.push("/dashboard")}
                variant="contained"
              >
                Sign in
              </Button>
            </Stack>
            <Box sx={{ flex: 1 }} />
          </Stack>
        </Container>
      </Container>
      <Container maxWidth="lg">
        <Stack flexDirection="row" alignItems="center" py={{ xs: 6, md: 12 }}>
          <Divider sx={{ flex: 1 }} color="#EA1506" />

          <Typography variant="h2" textAlign="center" mx={4}>
            How it works
          </Typography>
          <Divider sx={{ flex: 1 }} color="#EA1506" />
        </Stack>
        <Grid container spacing={2}>
          {cards.map((card, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  flex: 1,
                  padding: 2,
                  height: "100%",
                  background:
                    idx === 1
                      ? "linear-gradient(135deg, rgba(234,21,6,1) 40%, rgba(237,44,5,1) 70%, rgba(245,121,0,1) 100%)"
                      : undefined,
                }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: (theme) => theme.typography.body2.color }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack flexDirection="row" alignItems="center" py={{ xs: 6, md: 12 }}>
          <Divider sx={{ flex: 1 }} color="#EA1506" />
          <Typography variant="h2" textAlign="center" mx={4}>
            A new era for Fitness competitions
          </Typography>
          <Divider sx={{ flex: 1 }} color="#EA1506" />
        </Stack>
        <Typography variant="h4" textAlign="center">
          You can now open your event to a much larger audience <br />
          and unlock creative challenges thanks to near-realtime scoring.
        </Typography>
        {/* <Typography variant="h4" textAlign="center" gutterBottom>
          Our software is designed to be used by anyone, from the smallest local
          competition to the largest international event. We are currently
          working with a few selected partners to test our software, and will
          open it to the public in the coming months.
        </Typography> */}
        <Box sx={{ my: 8 }} />

        <Stack flexDirection="column" alignItems="center">
          <Button
            size="large"
            onClick={() =>
              window && window.open("https://calendly.com/roux-morgan/30min")
            }
            variant="contained"
            // color="inherit"
          >
            Book a demo
          </Button>
        </Stack>
      </Container>
      <Box sx={{ my: 4 }} />
      <Container maxWidth={false} sx={{ my: 4 }}>
        <Stack flexDirection="row">
          <Typography variant="body2">©️ Functional AI - 2024</Typography>
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
