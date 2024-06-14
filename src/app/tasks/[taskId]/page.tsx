"use client";

import { GetTaskResponse, getTask } from "@/services/backendApi/tasks";
import { Gavel, Start } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState<GetTaskResponse | null>(null);
  useEffect(() => {
    (async () => {
      const t = await getTask(params.taskId);
      setTask(t);
    })();
  }, [params.taskId]);

  const router = useRouter();
  return (
    <Container sx={{ height: "100%" }}>
      <Typography variant="h3">{`Task ${task?.uuid}`}</Typography>
      <Box sx={{ py: 4 }} />
      {task ? (
        <Stack flexDirection="column" gap={2} sx={{ maxWidth: "50%" }}>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" gutterBottom>
              {`Valid reps : ${task?.rep_frames?.length}`}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Start />}
              onClick={() => router.push(`${params.taskId}/good`)}
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
              {`Failed reps : ${task?.failed_frames.length}`}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Start />}
              onClick={() => router.push(`${params.taskId}/bad`)}
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
              {`Uncertain reps : ${task?.uncertain_frames.length}`}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Start />}
              onClick={() => router.push(`${params.taskId}/notsure`)}
            >
              Check
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack flexDirection="row">
          <Typography variant="h5">Loading...</Typography>
          <CircularProgress />
        </Stack>
      )}
    </Container>
  );
};

export default TaskPage;
