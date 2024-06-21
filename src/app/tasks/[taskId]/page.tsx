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
    ...(t.failed_frames ?? []),
    ...(t.rep_frames ?? []),
    ...(t.uncertain_frames ?? []),
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
    // const [previous, next] = findClosest(frame);
    // return [frame - (frame - previous) / 2, frame + (next - frame) / 2] as [
    //   number,
    //   number,
    // ];
    console.log("extractWindowView called", t.step_frames);

    const stepArray = [...t.step_frames];
    const stepArrayReverse = [...t.step_frames].reverse();
    const stepIndex = stepArray.findIndex(
      ([sepType, stepFrame]) => stepFrame === frame
    );
    const stepIndexReverse = stepArrayReverse.findIndex(
      ([sepType, stepFrame]) => stepFrame === frame
    );
    let foundSteps = [0, 0] as [number, number];
    if (stepIndex) {
      //bad rep
      if (t.failed_frames?.includes(frame) || t.uncertain_frames?.includes(frame)) {
        foundSteps[0] =
          stepArrayReverse
            .slice(stepIndexReverse + 1)
            .find(([sepType, stepFrame]) => sepType === "arms-straight-chin-down")?.[1] ??
          0;
        foundSteps[1] = frame;
      }
      // good rep
      else if (t.rep_frames?.includes(frame)) {
        foundSteps[0] =
          stepArrayReverse
            .slice(stepIndexReverse + 1)
            .find(([sepType, stepFrame]) => sepType === "arms-straight-chin-down")?.[1] ??
          0;
        foundSteps[1] =
          stepArray
            .slice(stepIndex + 1)
            .find(
              ([sepType, stepFrame]) => sepType === "arms-straight-chin-down"
            )?.[1] ?? 0;
      }
    }
    console.log("foundSteps", foundSteps);
    return foundSteps;
  };

  const markers: RepMarker[] = [
    ...(t.failed_frames ?? []).map((frame) => ({
      in_out: extractWindowView(frame),
      frame,
      status: "bad" as RepStatus,
    })),
    ...(t.rep_frames ?? []).map((frame) => ({
      in_out: extractWindowView(frame),
      frame,

      status: "good" as RepStatus,
    })),
    // ...(t.uncertain_frames ?? []).map((frame) => ({
    //   in_out: extractWindowView(frame),
    //   frame,
    //   status: "notsure" as RepStatus,
    // })),
  ];
  return markers.sort((a, b) => a.frame - b.frame);
};

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const router = useRouter();
  const theme = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<RepMarker[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RepStatus | null>(null);
  const [currentFrames, setCurrentFrames] = useState<number[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storage = localStorage.getItem(TASKS_KEY);
      const tasks = storage ? (JSON.parse(storage) as CachedTasks) : null;
      let task = tasks?.[params.taskId] as Task;
      if (!task) {
        // const intervalId = setInterval(async () => {
        try {
          const t = await getTask(params.taskId);
          if ("message" in t) {
            setErrors(t.message as string);
            return;
          }
          if (t) {
            {
              const markers = getMarkers(t);
              task = {
                initial: t,
                markers: markers,
              };
            }
            // clearInterval(intervalId);
            setErrors(null);
            setTask(task);
            localStorage.setItem(
              TASKS_KEY,
              JSON.stringify({ ...tasks, [params.taskId]: task })
            );
          }
        } catch (err) {
          console.error(err);
          setErrors("Error while fetching analysis");
          // clearInterval(intervalId);
        }
        // }, 5000);
      } else {
        // // Uncomment to reinit marker generation
        // task = {
        //   ...task,
        //   markers: getMarkers(task.initial),
        // };
        // localStorage.setItem(
        //   TASKS_KEY,
        //   JSON.stringify({ ...tasks, [params.taskId]: task })
        // );
        // //
        setTask(task);
      }
    })();
  }, [params.taskId]);

  useEffect(() => {
    console.log("Task: ", task);
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

  const updateMarkerStatus = (frame: number, status: RepStatus) => {
    setCurrentMarkers((markers) =>
      markers.map((m) => (m.frame === frame ? { ...m, status } : m))
    );
  };
  const goodMarkers = currentMarkers.filter((m) => m.status === "good");
  const badMarkers = currentMarkers.filter((m) => m.status === "bad");
  const notSureMarkers = currentMarkers.filter((m) => m.status === "notsure");

  return !task ? (
    <Container sx={{ height: "100%" }}>
      <Box sx={{ py: 4 }} />
      {errors ? (
        <>
          <Typography variant="h6">{errors}</Typography>
          <Box sx={{ py: 4 }} />
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
        </>
      ) : (
        <Stack flexDirection="row" gap={4}>
          <Typography variant="h5">Loading...</Typography>
          <CircularProgress />
        </Stack>
      )}
    </Container>
  ) : selectedStatus ? (
    <CheckReps
      goBack={() => setSelectedStatus(null)}
      status={selectedStatus}
      framesFiltered={currentFrames}
      updateMarkerStatus={updateMarkerStatus}
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
        {/* <Stack
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
        </Stack> */}
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
