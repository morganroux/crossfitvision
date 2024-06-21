import { createSignedUrl } from "@/services/aws/s3";
import { NextApiRequest, NextApiResponse } from "next";

// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const slug = params.slug; // 'a', 'b', or 'c'

//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
//     headers: {
//       "Content-Type": "application/json",
//       "API-Key": process.env.DATA_API_KEY!,
//     },
//   });
//   const product = await res.json();

//   return Response.json({ product });
// }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(); // Method Not Allowed
  }
  const body = await req.body;
  // TODO : add suffix if file already exist (easier to manage for user)
  const { filename } = body as { filename: string };
  const { url, key, options } = await createSignedUrl({ filename });
  return res.status(200).json({ url, options, key });
}

export default handler;
