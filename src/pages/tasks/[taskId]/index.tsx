

import { GetTaskResponse, getTask } from "@/services/nextApi/tasks";
import { Edit, Start } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
// import "./page.css";
import { useEffect, useState } from "react";
import CheckReps from "@/components/CheckReps";
import { CachedTasks, TASKS_KEY, Task } from "@/services/cache";
import _ from "lodash";
import Layout from "@/pages/Layout";
import { useRouter } from "next/router";

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

    const stepArray = [...t.step_frames];
    const stepArrayReverse = [...t.step_frames].reverse();
    const stepIndex = stepArray.findIndex(
      ([sepType, stepFrame]) => stepFrame === frame,
    );
    const stepIndexReverse = stepArrayReverse.findIndex(
      ([sepType, stepFrame]) => stepFrame === frame,
    );
    let foundSteps = [0, 0] as [number, number];
    if (stepIndex) {
      //bad rep
      if (
        t.failed_frames?.includes(frame) ||
        t.uncertain_frames?.includes(frame)
      ) {
        foundSteps[0] =
          stepArrayReverse
            .slice(stepIndexReverse + 1)
            .find(
              ([sepType, stepFrame]) => sepType === "arms-straight-chin-down",
            )?.[1] ?? 0;
        foundSteps[1] = frame;
      }
      // good rep
      else if (t.rep_frames?.includes(frame)) {
        foundSteps[0] =
          stepArrayReverse
            .slice(stepIndexReverse + 1)
            .find(
              ([sepType, stepFrame]) => sepType === "arms-straight-chin-down",
            )?.[1] ?? 0;
        foundSteps[1] =
          stepArray
            .slice(stepIndex + 1)
            .find(
              ([sepType, stepFrame]) => sepType === "arms-straight-chin-down",
            )?.[1] ?? 0;
      }
    }
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

const TaskPage = () => {
  const router = useRouter();
  const { taskId } = router.query as { taskId: string };
  const theme = useTheme();
  const [task, setTask] = useState<{ name: string; payload: Task } | null>(
    null,
  );
  const [editName, setEditName] = useState<string | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<RepMarker[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RepStatus | null>(null);
  const [currentFrames, setCurrentFrames] = useState<number[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storage = localStorage.getItem(TASKS_KEY);
      const tasks = storage ? (JSON.parse(storage) as CachedTasks) : null;
      let task = tasks?.[taskId];
      if (!task?.payload) {
        // const intervalId = setInterval(async () => {
        try {
          const t = await getTask(taskId);
          if ("message" in t) {
            setErrors(t.message as string);
            return;
          }
          if (t) {
            const markers = getMarkers(t);
            const newTask = {
              name: tasks?.[taskId]?.name ?? "Untitled task",
              payload: { initial: t, markers: markers },
            };

            // clearInterval(intervalId);
            setErrors(null);
            setTask(newTask);
            localStorage.setItem(
              TASKS_KEY,
              JSON.stringify({ ...tasks, [taskId]: newTask }),
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
        //   JSON.stringify({ ...tasks, [taskId]: task })
        // );
        // //
        setTask({ name: task.name, payload: task.payload });
      }
    })();
  }, [taskId]);

  useEffect(() => {
    if (task) setCurrentMarkers(task.payload.markers);
  }, [task]);

  const handleCheck = (status: RepStatus) => {
    setSelectedStatus(status);
    setCurrentFrames(
      currentMarkers.filter((m) => m.status === status).map((m) => m.frame),
    );
  };
  const handleBack = () => router.push("/");
  const handleUpdate = () => {
    if (!task) return;
    localStorage.setItem(
      TASKS_KEY,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(TASKS_KEY) || "{}"),
        [taskId]: _.merge(task, {
          payload: { markers: currentMarkers },
        }),
      }),
    );
    handleBack();
  };

  const updateMarkerStatus = (frame: number, status: RepStatus) => {
    setCurrentMarkers((markers) =>
      markers.map((m) => (m.frame === frame ? { ...m, status } : m)),
    );
  };
  const goodMarkers = currentMarkers.filter((m) => m.status === "good");
  const badMarkers = currentMarkers.filter((m) => m.status === "bad");
  const notSureMarkers = currentMarkers.filter((m) => m.status === "notsure");

  return !task ? (
    <Container sx={{ height: "100%", pt: 3 }}>
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
      video={task.payload.initial.url}
    />
  ) : (
    <Container sx={{ height: "100%", pt: 3 }}>
      <Stack flexDirection="column" alignItems="flex-start">
        {editName ? (
          <TextField
            value={editName}
            autoFocus
            size="small"
            onBlur={() => {
              setTask({
                ...task,
                name: !editName?.length ? "Untitled task" : editName,
              });
              setEditName(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTask({
                  ...task,
                  name: !editName?.length ? "Untitled task" : editName,
                });
                setEditName(null);
              }
              if (e.key === "Escape") setEditName(null);
            }}
            onChange={(e) => setEditName(e.target.value)}
            variant="standard"
            sx={{
              "& .MuiInputBase-input": {
                ...theme.typography.h3,
              },
            }}
          />
        ) : (
          <Stack flexDirection="row">
            <Typography
              variant="h3"
              sx={{ textTransform: "capitalize" }}
            >{`${task.name}`}</Typography>
            <IconButton
              color="secondary"
              sx={{ alignSelf: "flex-end", ml: 3 }}
              onClick={() => setEditName(task.name)}
            >
              <Edit />
            </IconButton>
          </Stack>
        )}
        <Typography variant="caption">{`${task.payload.initial.uuid}`}</Typography>
      </Stack>
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

TaskPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default TaskPage;
