import { Close, CloudUpload } from "@mui/icons-material";
import { IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MyDropzone = (props: {
  handleChange: (files: File[]) => void;
  disabled: boolean;
  files: File[];
}) => {
  const { handleChange, disabled } = props;
  const [dragIn, setDragIn] = React.useState<boolean>(false);
  const theme = useTheme();
  const onDrop = (acceptedFiles: File[]) => {
    setDragIn(false);
    handleChange(acceptedFiles);
  };
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    setDragIn(true);
    event.preventDefault();
  };
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setDragIn(false);
    event.preventDefault();
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
  });

  return (
    <Paper
      sx={{
        [theme.breakpoints.down("md")]: { width: "90vw", height: "100px" },
        width: (theme) => theme.spacing(70),
        height: "150px",
      }}
    >
      {props.files.length > 0 ? (
        <Stack
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            px: 2,
          }}
        >
          <IconButton
            onClick={() => handleChange([])}
            sx={{ alignSelf: "flex-end" }}
          >
            <Close />
          </IconButton>
          {props.files.map((file) => (
            <Typography key={file.name}>{file.name}</Typography>
          ))}
        </Stack>
      ) : (
        <Stack
          {...getRootProps()}
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input {...getInputProps()} disabled={disabled} />
          <CloudUpload
            color={dragIn ? "primary" : undefined}
            sx={{
              transition: "color 0.3s ease-in-out",
            }}
            fontSize="large"
          />
          <Typography>Drag files here</Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default MyDropzone;
