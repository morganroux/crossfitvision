import axios from "axios";
import nextApi from ".";

interface PutFileResponse {}

export const putFileToS3 = async (file: File) => {
  const filename = file.name;

  const data = await postFile({ filename });
  if (data) {
    const { url, options, key } = data;

    if (!url) throw new Error("Cannot retrieve a signed request");
    const response = await axios.put<PutFileResponse>(url, file, options);
    const accessUrl = `https://event-copilot.s3.eu-west-1.amazonaws.com/${key}`;

    return accessUrl;
  }
  throw new Error("Error with s3");
};

export const postFile = async (body: { filename: string }) => {
  const { data } = await nextApi<{ url: string; options: any; key: any }>({
    method: "post",
    url: `/files`,
    data: body,
  });
  return data;
};
