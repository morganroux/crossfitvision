"use client";

import MyReactPlayer from "@/components/MyReactPlayer";
import { GetTaskResponse, getTask } from "@/services/backendApi/tasks";
import {
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
} from "@mui/material";
import { useEffect, useState } from "react";
import "./page.css";

const videos = [
  "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-04-24+at+19.56.05.mp4",
  "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-05-17+at+19.51.12.mp4",
];

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState<GetTaskResponse>();
  const [status, setStatus] = useState<"good" | "bad" | "notsure" | null>(null);
  const [videoIdx, setVideoIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

  useEffect(() => {
    (async () => {
      const t = await getTask(params.taskId);
      setTask(t);
    })();
  }, [params.taskId]);
  const handlePrev = () => {
    setSlideDirection("slideOutLeft");
    setTimeout(() => {
      setVideoIdx((idx) => (idx - 1) % videos.length);
      setSlideDirection("slideInRight");
    }, 200);
  };
  const handleNext = () => {
    setSlideDirection("slideOutRight");
    setTimeout(() => {
      setVideoIdx((idx) => (idx + 1) % videos.length);
      setSlideDirection("slideInLeft");
    }, 200);
  };

  const handleBad = () => {
    setStatus((status) => {
      if (status === "bad") return "bad";
      else {
        setTimeout(handleNext, 300);
        return "bad";
      }
    });
  };
  const handleGood = () => {
    setStatus((status) => {
      if (status === "good") return "good";
      else {
        setTimeout(handleNext, 300);
        return "good";
      }
    });
  };
  const handleNotSure = () => {
    setStatus((status) => {
      if (status === "notsure") return "notsure";
      else {
        setTimeout(handleNext, 300);
        return "notsure";
      }
    });
  };

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
  }, []);

  return (
    <Container>
      <Typography variant="h3">{`Task Page ${params.taskId}`} </Typography>

      {task ? (
        <Stack flexDirection="column" alignContent="center">
          <Typography
            gutterBottom
            variant="h5"
            align="center"
          >{`Rep ${videoIdx + 1}/${videos.length}`}</Typography>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={handlePrev}
              sx={{ background: (theme) => theme.palette.background.paper }}
            >
              <ChevronLeft sx={{ fontSize: 40 }} />
            </IconButton>
            <Box overflow="hidden">
              <div className={slideDirection}>
                <MyReactPlayer video={videos[videoIdx]} start={2} end={3} />
              </div>
            </Box>
            <IconButton
              onClick={handleNext}
              sx={{ background: (theme) => theme.palette.background.paper }}
            >
              <ChevronRight sx={{ fontSize: 40 }} />
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
              startIcon={<ThumbDown color="error" />}
            >
              Bad Rep
            </Button>
            <Button
              onClick={handleNotSure}
              variant={status === "notsure" ? "contained" : "outlined"}
              startIcon={<QuestionMark color="info" />}
            >
              Not Sure
            </Button>
            <Button
              onClick={handleGood}
              variant={status === "good" ? "contained" : "outlined"}
              startIcon={<CheckCircle color="success" />}
            >
              Good Rep
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};

export default TaskPage;
