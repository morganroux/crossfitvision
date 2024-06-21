import { RepMarker } from "@/pages/tasks/[taskId]";
import { GetTaskResponse } from "../backendApi/tasks";

export interface Task {
  initial: GetTaskResponse;
  markers: RepMarker[];
}
export interface CachedTasks {
  [taskId: string]: { name: string; payload: null | Task };
}

export const TASKS_KEY = "tasks";

export const getCachedTasks = () => {
  const storage = localStorage.getItem(TASKS_KEY);
  if (!storage) return {} as CachedTasks;
  else return JSON.parse(storage) as CachedTasks;
};
