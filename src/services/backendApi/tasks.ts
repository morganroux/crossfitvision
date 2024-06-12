import backendApi from ".";

export const getTasks = async () => {
  const { data } = await backendApi<{ tasks: string[] }>({
    method: "get",
    url: `/tasks`,
  });
  return data;
};

interface GetTaskResponse {
  task: string;
  count: 0;
  rep_frames: number[];
  step_frames: number[];
  uncertain_frames: number[];
  uuid: string;
  url: string;
}

export const getTask = async (taskId: string) => {
  const { data } = await backendApi<GetTaskResponse>({
    method: "get",
    url: `/tasks/${taskId}`,
  });
  return data;
};
