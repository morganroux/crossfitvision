import { startCount } from "@/services/backendApi/count";

export async function POST(request: Request) {
  const body = await request.json();
  // TODO : add suffix if file already exist (easier to manage for user)
  const { url, task } = body as { url: string; task: string };
  const { task_id } = await startCount({ url, task });
  return Response.json({ task_id });
}
