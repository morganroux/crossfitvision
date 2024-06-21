import { startCount } from "@/services/backendApi/count";
import {
  NextApiRequest,
  NextApiRequestWithSession,
  NextApiResponse,
} from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = await req.body;
    // TODO : add suffix if file already exist (easier to manage for user)
    const { url, task } = body as { url: string; task: string };
    const { task_id } = await startCount({ url, task });
    res.status(200).json({ task_id });
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(); // Method Not Allowed
  }
}

export default handler;
