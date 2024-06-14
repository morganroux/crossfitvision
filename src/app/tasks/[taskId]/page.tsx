"use client";

import { GetTaskResponse, getTask } from "@/services/backendApi/tasks";
import { Start } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import "./page.css";
import { use, useEffect, useMemo, useState } from "react";
import CheckReps from "@/components/CheckReps";

export type RepStatus = "good" | "bad" | "notsure";
export type RepMarker = { in_out: [number, number]; status: RepStatus };

const getMarkers = (t: GetTaskResponse) => {
  const orderedSteps = [
    0,
    ...t.failed_frames,
    ...t.rep_frames,
    ...t.uncertain_frames,
    10,
  ].sort((a, b) => a - b);
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
  const averageFrameLenght =
    orderedSteps.reduce((acc, curr) => acc + curr, 0) / orderedSteps.length;
  const markers: RepMarker[] = [
    ...t.failed_frames.map((frame) => ({
      in_out: findClosest(frame),
      status: "bad" as RepStatus,
    })),
    ...t.rep_frames.map((frame) => ({
      in_out: findClosest(frame),
      status: "good" as RepStatus,
    })),
    ...t.uncertain_frames.map((frame) => ({
      in_out: findClosest(frame),
      status: "notsure" as RepStatus,
    })),
  ];
  return markers;
};

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState<GetTaskResponse | null>(null);
  const [markers, setMarkers] = useState<RepMarker[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RepStatus | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<RepMarker[]>([]);
  useEffect(() => {
    (async () => {
      const t = await getTask(params.taskId);
      setTask(t);
    })();
  }, [params.taskId]);

  useEffect(() => {
    if (!task) return;
    const markers = getMarkers(task);
    setMarkers(markers);
  }, [task]);

  const handleCheck = (status: RepStatus) => {
    setSelectedStatus(status);
    setCurrentMarkers(markers.filter((m) => m.status === status));
  };
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
      markers={currentMarkers}
      video={task.url}
    />
  ) : (
    <Container sx={{ height: "100%" }}>
      <Typography variant="h3">{`Task ${task.uuid}`}</Typography>
      <Box sx={{ py: 4 }} />

      <Stack flexDirection="column" gap={2} sx={{ maxWidth: "50%" }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            {`Valid reps : ${task.rep_frames?.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Start />}
            disabled={task.rep_frames.length === 0}
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
            {`Failed reps : ${task.failed_frames.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Start />}
            disabled={task.failed_frames.length === 0}
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
            {`Uncertain reps : ${task.uncertain_frames.length}`}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            disabled={task.uncertain_frames.length === 0}
            startIcon={<Start />}
            onClick={() => handleCheck("notsure")}
          >
            Check
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TaskPage;
