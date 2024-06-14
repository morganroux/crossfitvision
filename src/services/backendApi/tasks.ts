import backendApi from ".";

export const getTasks = async () => {
  const { data } = await backendApi<{ tasks: string[] }>({
    method: "get",
    url: `/tasks`,
  });
  return data;
};

export interface GetTaskResponse {
  // TODO : frame rate, duration
  task: string;
  count: number;
  failed_rep_count: number;
  rep_frames: number[];
  failed_frames: number[];
  uncertain_frames: number[];
  step_frames: [string, number][];
  uuid: string;
  url: string;
}

export const getTask = async (taskId: string) => {
  return {
    task: "taskname",
    count: 10,
    failed_rep_count: 5,
    step_frames: [],
    rep_frames: [1, 3, 5, 7],
    failed_frames: [1, 2, 4, 8],
    uncertain_frames: [],
    uuid: "lkjzdslckj",
    url: "https://event-copilot.s3.eu-west-1.amazonaws.com/crossfit/WhatsApp+Video+2024-04-24+at+19.56.05.mp4",
  };

  const { data } = await backendApi<GetTaskResponse>({
    method: "get",
    url: `/tasks/${taskId}`,
  });
  return data;
};
