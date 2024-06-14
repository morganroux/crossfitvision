"use client";

import background from "../../public/pexels-2261477.jpg";
import MyDropzone from "@/components/MyDropZone";
import { startCount } from "@/services/backendApi/count";
import { getTasks } from "@/services/backendApi/tasks";
import { putFileToS3 } from "@/services/nextApi/files";
import { ExpandCircleDown } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const shake = keyframes`
  0%,
	50% {
		transform: translateY(0);
	}

	5%,
	15%,
	25%,
	35% {
		transform: translateY(-4px);
	}

	10%,
	20%,
	30% {
		transform: translateY(4px);
	}

	40% {
		transform: translateY(3.2px);
	}

	45% {
		transform: translateY(-3.2px);
	}

`;

const IndexPage = () => {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tasksContainerRef = useRef<HTMLDivElement>(null);
  const [taskIds, setTaskIds] = useState<string[]>([]);

  const handleSend = async () => {
    setLoading(true);
    try {
      const url = await putFileToS3(uploadFiles[0]);
      const { task_id } = await startCount({ url, task: "pull-ups-simple" });
      router.push(`/tasks/${task_id}`);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    const data = await getTasks();
    setTaskIds(data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleScrollToTasks = () => {
    tasksContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 8,
          paddingTop: 4,
          "::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 100%)",
            zIndex: 1,
          },
        }}
      >
        {/* <Box
        sx={{
          width: "100%",
          height: "80vh",
          position: "relative",
        }}
      > */}
        <Image
          priority
          src={background}
          alt="crossfit workout"
          fill={true}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
        />
        <Typography
          variant="h1"
          textAlign="center"
          sx={{ zIndex: 2, position: "relative", flex: 1 }}
        >
          crossfit vision
        </Typography>

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Stack alignItems="center">
            <Typography variant="h5" textAlign="center">
              Load a file to start a new analysis
            </Typography>
            <Box sx={{ my: 1 }} />
            <Box>
              <MyDropzone
                handleChange={(files: File[]) => setUploadFiles(files)}
                disabled={loading}
                files={uploadFiles}
              />
            </Box>
            <Box sx={{ my: 1 }} />

            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={!uploadFiles.length}
                sx={{
                  transition:
                    "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                }}
              >
                Start analysis
              </Button>
            )}
            <Box sx={{ my: 4 }} />
            <Typography variant="h5" textAlign="center">
              or select a previous one
            </Typography>
            <Box sx={{ my: 1 }} />
            <IconButton onClick={handleScrollToTasks}>
              <ExpandCircleDown
                fontSize="large"
                sx={{ animation: `${shake} 3s ease 0s infinite normal` }}
              />
            </IconButton>
          </Stack>
        </Container>
      </Container>

      <Container ref={tasksContainerRef} sx={{ height: "100vh" }}>
        <Divider sx={{ my: 4 }} />
        <Stack alignItems="center">
          {taskIds?.length ? (
            taskIds.map((taskId) => (
              <Button
                key={taskId}
                variant="contained"
                color="primary"
                onClick={() => router.push(`/tasks/${taskId}`)}
              >
                {taskId}
              </Button>
            ))
          ) : (
            <Typography variant="h6" textAlign="center">
              No previous tasks
            </Typography>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default IndexPage;
