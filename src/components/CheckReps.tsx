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
  ButtonProps,
  Container,
  IconButton,
  Stack,
  Typography,
  keyframes,
  makeStyles,
  styled,
  useTheme,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  MouseEventHandler,
} from "react";
import { RepMarker, RepStatus } from "../app/tasks/[taskId]/page";

// const videos = [
//   "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-04-24+at+19.56.05.mp4",
//   "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-05-17+at+19.51.12.mp4",
// ];

const makeBlink: MouseEventHandler<HTMLButtonElement> = (ev) => {
  const el = ev.currentTarget;
  el.classList.remove("blink-button");
  void el.offsetWidth;
  el.classList.add("blink-button");
};

const CheckReps = (props: {
  goBack: () => void;
  status: RepStatus;
  updateMarkerStatus: (frame: number, status: RepStatus) => void;
  framesFiltered: number[];
  markers: RepMarker[];
  video: string;
}) => {
  const { markers, framesFiltered, video, updateMarkerStatus } = props;
  const [markerIdx, setMarkerIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const theme = useTheme();
  const markersFiltered = useMemo(
    () =>
      markers.filter((marker) =>
        framesFiltered.find((f) => f === marker.frame)
      ),
    [framesFiltered, markers]
  );

  const currentMarker = markersFiltered[markerIdx];
  const handlePrev = useCallback(() => {
    setSlideDirection("slideOutLeft");
    setTimeout(() => {
      setMarkerIdx(
        (idx) => (idx - 1 + markersFiltered.length) % markersFiltered.length
      );
      setSlideDirection("slideInRight");
    }, 200);
  }, [markersFiltered.length]);

  const handleNext = useCallback(() => {
    setSlideDirection("slideOutRight");
    setTimeout(() => {
      setMarkerIdx((idx) => (idx + 1) % markersFiltered.length);
      setSlideDirection("slideInLeft");
    }, 200);
  }, [markersFiltered.length]);

  const handleBad = useCallback(async () => {
    updateMarkerStatus(currentMarker.frame, "bad");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext, updateMarkerStatus, currentMarker.frame]);

  const handleGood = useCallback(async () => {
    updateMarkerStatus(currentMarker.frame, "good");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext, updateMarkerStatus, currentMarker.frame]);
  const handleNotSure = useCallback(async () => {
    updateMarkerStatus(currentMarker.frame, "notsure");
    await new Promise((resolve) => setTimeout(resolve, 500));
    handleNext();
  }, [handleNext, updateMarkerStatus, currentMarker.frame]);

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
        >{`Rep ${markerIdx + 1}/${markersFiltered.length}`}</Typography>
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
                start={currentMarker.in_out[0] / 30} //TODO : extract frame rate or duration from video
                end={currentMarker.in_out[1] / 30}
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
            onClick={(ev) => {
              makeBlink(ev);
              setTimeout(handleBad, 300);
            }}
            variant={currentMarker.status === "bad" ? "contained" : "outlined"}
            startIcon={<ThumbDown color="error" />}
          >
            Bad Rep
          </Button>
          <Button
            onClick={(ev) => {
              makeBlink(ev);
              setTimeout(handleNotSure, 300);
            }}
            variant={
              currentMarker.status === "notsure" ? "contained" : "outlined"
            }
            startIcon={<QuestionMark color="info" />}
          >
            Not Sure
          </Button>
          <Button
            onClick={(ev) => {
              makeBlink(ev);
              setTimeout(handleGood, 300);
            }}
            variant={currentMarker.status === "good" ? "contained" : "outlined"}
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
