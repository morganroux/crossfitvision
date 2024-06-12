import { createSignedUrl } from "@/services/aws/s3";

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
export async function POST(request: Request) {
  const body = await request.json();
  // TODO : add suffix if file already exist (easier to manage for user)
  const { filename } = body as { filename: string };
  const { url, key, options } = await createSignedUrl({ filename });
  return Response.json({ url, options, key });
}
