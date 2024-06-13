import React from "react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const MyReactPlayer = (props: {
  video: string;
  start: number;
  end: number;
}) => {
  const [isReady, setIsReady] = useState(false);
  const player = useRef<ReactPlayer | null>(null);
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  useEffect(() => {
    if (isReady) player.current?.seekTo(props.start, "seconds");
  });

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (playedSeconds > props.end) {
      player.current?.seekTo(props.start, "seconds");
    }
  };

  const handleReady = () => {
    setIsReady(true);
  };
  return (
    hasWindow && (
      <ReactPlayer
        ref={(ref) => {
          player.current = ref;
        }}
        url={props.video}
        volume={0}
        playing
        onProgress={handleProgress}
        onReady={handleReady}
      />
    )
  );
};

export default React.memo(MyReactPlayer);
