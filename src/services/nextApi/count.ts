import nextApi from ".";

export const startCount = async (body: { url: string; task: string }) => {
  const { data } = await nextApi<{ task_id: string }>({
    method: "post",
    url: `/count`,
    data: body,
  });
  return data;
};
