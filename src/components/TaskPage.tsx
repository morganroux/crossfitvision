"use client";

import { Typography } from "@mui/material";

const TaskPage = (props: {
  taskId: string;
  setTaskId: (taskId: string) => void;
}) => {
  return <Typography variant="h3">Task Page</Typography>;
};

export default TaskPage;
