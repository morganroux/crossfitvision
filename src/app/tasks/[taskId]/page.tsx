"use client";

import { Container, Typography } from "@mui/material";

const TaskPage = ({ params }: { params: { taskId: string } }) => {
  return (
    <Container>
      <Typography variant="h3">{`Task Page ${params.taskId}`} </Typography>
    </Container>
  );
};

export default TaskPage;
