import backendApi from ".";

export const getTasks = async () => {
  const { data } = await backendApi<{ tasks: string[] }>({
    method: "get",
    url: `/tasks`,
  });
  return data;
};

export interface GetTaskResponse {
  task: string;
  count: number;
  rep_frames: number[];
  step_frames: (null | number)[][];
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
