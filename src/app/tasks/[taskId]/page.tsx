"use client";

import MyReactPlayer from "@/components/MyReactPlayer";
import { GetTaskResponse, getTask } from "@/services/backendApi/tasks";
import { Container, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const video =
  "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-04-24+at+19.56.05.mp4";

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState<GetTaskResponse>();

  useEffect(() => {
    (async () => {
      const t = await getTask(params.taskId);
      setTask(t);
    })();
  }, [params.taskId]);

  return (
    <Container>
      <Typography variant="h3">{`Task Page ${params.taskId}`} </Typography>
      {task ? <></> : <Typography>Loading...</Typography>}
      <MyReactPlayer video={video} start={2} end={5} />
    </Container>
  );
};

export default TaskPage;
