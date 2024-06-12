import AWS from "aws-sdk";
import mime from "mime-types";

const awsBucket = "event-copilot";
const s3UploadPath = "crossfit";

export const buildUploadskey = async (params: {
  filename: string;
}): Promise<string> => {
  const currentDate = Date.now();
  const key = `${s3UploadPath}/${currentDate}_${params.filename
    .normalize("NFD")
    .replace(/[',/#!$%^& *;:{}=\-_`~()]/g, "")
    .replace(/[\u0300-\u036f]/g, "")}`;
  return key;
};

export const getFilesFromProjectId = async (projectId: string) => {
  const s3 = new AWS.S3();
  const prefix = `${s3UploadPath}/`;
  const params = {
    Bucket: awsBucket,
    Prefix: prefix,
  };
  const { Contents } = await s3.listObjectsV2(params).promise();
  const files = Contents?.map((file) => ({
    ...file,
    name: file.Key?.replace(prefix, "")?.split("_")?.[1] ?? "unknown name",
    url: `https://${awsBucket}.s3.amazonaws.com/${file.Key}`,
  }));
  return files ?? [];
};

export const createSignedUrl = async ({ filename }: { filename: string }) => {
  const fileType = mime.lookup(filename); // Use mime-types to get the correct MIME type
  if (!fileType) throw new Error("Invalid file type");
  // TODO : add subfolders in the keys
  const key = await buildUploadskey({ filename });
  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: awsBucket,
    Key: key,
    Expires: 60 * 30,
    ContentType: fileType,
  };
  const options = {
    headers: {
      "Content-Type": fileType,
    },
  };
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  const s3 = new AWS.S3();
  const url = await s3.getSignedUrlPromise("putObject", s3Params);
  return { url, key, options };
};
