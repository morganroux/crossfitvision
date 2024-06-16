"use client";

import { GetTaskResponse, getTask } from "@/services/nextApi/tasks";
import { Start } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import "./page.css";
import { useEffect, useState } from "react";
import CheckReps from "@/components/CheckReps";
import { useRouter } from "next/navigation";
import { CachedTasks, TASKS_KEY, Task } from "@/services/cache";

export type RepStatus = "good" | "bad" | "notsure";
export type RepMarker = {
  in_out: [number, number];
  status: RepStatus;
  frame: number;
};

const getMarkers = (t: GetTaskResponse) => {
  const orderedSteps = [
    0,
    ...t.failed_frames,
    ...t.rep_frames,
    ...t.uncertain_frames,
    30000, //change to duration
  ].sort((a, b) => a - b);
  const averageRepLenght =
    orderedSteps.reduce((acc, curr) => acc + curr, 0) / orderedSteps.length;

  const findClosest = (frame: number) => {
    const previousFrameIdx =
      (orderedSteps.indexOf(frame) - 1) % orderedSteps.length;
    const nextFrameIdx =
      (orderedSteps.indexOf(frame) + 1) % orderedSteps.length;
    return [orderedSteps[previousFrameIdx], orderedSteps[nextFrameIdx]] as [
      number,
      number,
    ];
  };
  const extractWindowView = (frame: number) => {
    const [previous, next] = findClosest(frame);
    return [frame - (frame - previous) / 3, frame + (next - frame) / 3] as [
      number,
      number,
    ];
  };

  const markers: RepMarker[] = [
    ...t.failed_frames.map((frame) => ({
      in_out: extractWindowView(frame),
      frame,
      status: "bad" as RepStatus,
    })),
    ...t.rep_frames.map((frame) => ({
      in_out: extractWindowView(frame),
      frame,

      status: "good" as RepStatus,
    })),
    ...t.uncertain_frames.map((frame) => ({
      in_out: extractWindowView(frame),
      frame,
      status: "notsure" as RepStatus,
    })),
  ];
  return markers;
};

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const router = useRouter();
  const theme = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<RepMarker[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RepStatus | null>(null);
  const [currentFrames, setCurrentFrames] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const storage = localStorage.getItem(TASKS_KEY);
      const tasks = storage ? (JSON.parse(storage) as CachedTasks) : null;
      let task = tasks?.[params.taskId] as Task;
      if (!task) {
        const t = await getTask(params.taskId);
        task = {
          initial: t,
          markers: getMarkers(t),
        };
      }
      task = {
        ...task,
        markers: getMarkers(task.initial),
      };
      setTask(task);
      localStorage.setItem(
        TASKS_KEY,
        JSON.stringify({ ...tasks, [params.taskId]: task })
      );
    })();
  }, [params.taskId]);

  useEffect(() => {
    if (task) setCurrentMarkers(task.markers);
  }, [task]);

  const handleCheck = (status: RepStatus) => {
    setSelectedStatus(status);
    setCurrentFrames(
      currentMarkers.filter((m) => m.status === status).map((m) => m.frame)
    );
  };
  const handleBack = () => router.push("/");
  const handleUpdate = () => {
    if (!task) return;
    localStorage.setItem(
      TASKS_KEY,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(TASKS_KEY) || "{}"),
        [params.taskId]: { ...task, markers: currentMarkers },
      })
    );
    handleBack();
  };

  const goodMarkers = currentMarkers.filter((m) => m.status === "good");
  const badMarkers = currentMarkers.filter((m) => m.status === "bad");
  const notSureMarkers = currentMarkers.filter((m) => m.status === "notsure");

  return !task ? (
    <Container sx={{ height: "100%" }}>
      <Stack flexDirection="row" gap={4}>
        <Typography variant="h5">Loading...</Typography>
        <CircularProgress />
      </Stack>
    </Container>
  ) : selectedStatus ? (
    <CheckReps
      goBack={() => setSelectedStatus(null)}
      status={selectedStatus}
      framesFiltered={currentFrames}
      updateMarkerStatus={(frame, status) => {
        setCurrentMarkers((markers) =>
          markers.map((m) => (m.frame === frame ? { ...m, status } : m))
        );
      }}
      markers={currentMarkers}
      video={task.initial.url}
    />
  ) : (
    <Container sx={{ height: "100%" }}>
      <Typography variant="h3">{`Task ${task.initial.uuid}`}</Typography>
      <Box sx={{ py: 4 }} />

      <Stack
        flexDirection="column"
        gap={2}
        sx={{
          [theme.breakpoints.up("md")]: { maxWidth: "50%" },
          [theme.breakpoints.down("md")]: { maxWidth: "100%" },
        }}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            {`Valid reps : ${goodMarkers.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Start />}
            disabled={goodMarkers.length === 0}
            onClick={() => handleCheck("good")}
          >
            Check
          </Button>
        </Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            {`Failed reps : ${badMarkers.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Start />}
            disabled={badMarkers.length === 0}
            onClick={() => handleCheck("bad")}
          >
            Check
          </Button>
        </Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            {`Uncertain reps : ${notSureMarkers.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            disabled={notSureMarkers.length === 0}
            startIcon={<Start />}
            onClick={() => handleCheck("notsure")}
          >
            Check
          </Button>
        </Stack>
        <Box sx={{ py: 4 }} />
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update results
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TaskPage;
