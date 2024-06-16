import { getTasks } from "@/services/backendApi/tasks";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const data = await getTasks();

  return Response.json(data);
}
// export async function POST(request: Request) {
//   const body = await request.json();
//   // TODO : add suffix if file already exist (easier to manage for user)
//   const { filename } = body as { filename: string };
//   const { url, key, options } = await createSignedUrl({ filename });
//   return Response.json({ url, options, key });
// }