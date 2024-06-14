"use client";

import MyReactPlayer from "@/components/MyReactPlayer";
import {
  ArrowBack,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  QuestionMark,
  ThumbDown,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
  keyframes,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RepMarker, RepStatus } from "../app/tasks/[taskId]/page";

// const videos = [
//   "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-04-24+at+19.56.05.mp4",
//   "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-05-17+at+19.51.12.mp4",
// ];

const blink = (color1: string, color2: string) => keyframes`
  0%, 100% {background-color:${color2};}
  50% {background-color: ${color1};}
`;

const CheckReps = (props: {
  goBack: () => void;
  status: RepStatus;
  markers: RepMarker[];
  video: string;
}) => {
  const { markers, video } = props;
  const [status, setStatus] = useState<RepStatus | null>(null);
  const [markerIdx, setMarkerIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const theme = useTheme();

  const handlePrev = useCallback(() => {
    setSlideDirection("slideOutLeft");
    setTimeout(() => {
      setMarkerIdx((idx) => (idx - 1 + markers.length) % markers.length);
      setSlideDirection("slideInRight");
    }, 200);
  }, [markers.length]);

  const handleNext = useCallback(() => {
    setSlideDirection("slideOutRight");
    setTimeout(() => {
      setMarkerIdx((idx) => (idx + 1) % markers.length);
      setSlideDirection("slideInLeft");
    }, 200);
  }, [markers.length]);

  const handleBad = useCallback(async () => {
    setStatus("bad");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext]);

  const handleGood = useCallback(async () => {
    setStatus("good");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext]);
  const handleNotSure = useCallback(async () => {
    setStatus("notsure");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "a":
          handleBad();
          break;
        case "z":
          handleNotSure();
          break;
        case "e":
          handleGood();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleBad, handleGood, handleNext, handlePrev, handleNotSure]);

  const title = {
    bad: "Failed reps",
    notsure: "Uncertain reps",
    good: "Valid reps",
  };
  return (
    <Container sx={{ height: "100%" }}>
      <Typography variant="h3" gutterBottom>
        {title[props.status]}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={props.goBack}
      >
        Back
      </Button>
      <Stack flexDirection="column" alignContent="center" height="80%">
        <Typography
          gutterBottom
          variant="h5"
          align="center"
        >{`Rep ${markerIdx + 1}/${markers.length}`}</Typography>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flex={1}
        >
          <IconButton
            onClick={handlePrev}
            sx={{ background: (theme) => theme.palette.background.paper }}
          >
            <ChevronLeft
              sx={{
                fontSize: 40,
                [theme.breakpoints.down("md")]: {
                  fontSize: 30,
                },
              }}
            />
          </IconButton>
          <Box overflow="hidden">
            <div className={slideDirection}>
              <MyReactPlayer
                video={video}
                start={markers[markerIdx].in_out[0]}
                end={markers[markerIdx].in_out[1]}
              />
            </div>
          </Box>
          <IconButton
            onClick={handleNext}
            sx={{
              background: (theme) => theme.palette.background.paper,
            }}
          >
            <ChevronRight
              sx={{
                fontSize: 40,
                [theme.breakpoints.down("md")]: {
                  fontSize: 30,
                },
              }}
            />
          </IconButton>
        </Stack>
        <Box sx={{ py: 2 }} />
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Button
            onClick={handleBad}
            variant={status === "bad" ? "contained" : "outlined"}
            sx={{
              animation:
                status === "bad"
                  ? `${blink(theme.palette.primary.main, theme.palette.primary.dark)} 0.15s 3`
                  : undefined,
            }}
            startIcon={<ThumbDown color="error" />}
          >
            Bad Rep
          </Button>
          <Button
            onClick={handleNotSure}
            variant={status === "notsure" ? "contained" : "outlined"}
            sx={{
              animation:
                status === "notsure"
                  ? `${blink(theme.palette.primary.main, theme.palette.primary.dark)} 0.15s 3`
                  : undefined,
            }}
            startIcon={<QuestionMark color="info" />}
          >
            Not Sure
          </Button>
          <Button
            onClick={handleGood}
            variant={status === "good" ? "contained" : "outlined"}
            sx={{
              animation:
                status === "good"
                  ? `${blink(theme.palette.primary.main, theme.palette.primary.dark)} 0.15s 3`
                  : undefined,
            }}
            startIcon={<CheckCircle color="success" />}
          >
            Good Rep
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default CheckReps;
