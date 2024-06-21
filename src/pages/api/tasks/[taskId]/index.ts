import { getTask } from "@/services/backendApi/tasks";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { taskId } = req.query as { taskId: string };
    const data = await getTask(taskId);
    return res.json(data);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(); // Method Not Allowed
  }
}

export default handler;
// export async function POST(request: Request) {
//   const body = await request.json();
//   // TODO : add suffix if file already exist (easier to manage for user)
//   const { filename } = body as { filename: string };
//   const { url, key, options } = await createSignedUrl({ filename });
//   return Response.json({ url, options, key });
// }
