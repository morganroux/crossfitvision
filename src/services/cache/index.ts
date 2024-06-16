import { RepMarker } from "@/app/tasks/[taskId]/page";
import { GetTaskResponse } from "../backendApi/tasks";

export interface Task {
  initial: GetTaskResponse;
  markers: RepMarker[];
}
export interface CachedTasks {
  [taskId: string]: null | Task;
}

export const TASKS_KEY = "tasks";

export const getCachedTasks = () => {
  const storage = localStorage.getItem(TASKS_KEY);
  if (!storage) return [];
  else return JSON.parse(storage) as CachedTasks;
};
