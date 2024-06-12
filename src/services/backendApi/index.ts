import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosBetterStacktrace from "axios-better-stacktrace";

// This api should be used only client side

const nextApi = axios.create({
  timeout: 30000,
});

axiosBetterStacktrace(nextApi);

// nextApi.interceptors.request.use(async (axiosConfig) => {
//   if (typeof sessionStorage === "undefined") return axiosConfig;
//   const token = sessionStorage.getItem(config.tokenName);

//   if (token) {
//     axiosConfig.headers.Authorization = `Bearer ${token || ""}`;
//   }
//   return axiosConfig;
// });

export default nextApi;

// export default async function nextApiWithErrorHandling<T = any>(
//   config: AxiosRequestConfig<T>
// ): Promise<{ data?: T; error?: string }> {
//   try {
//     const ret = await nextApi.request<T>(config);
//     return { data: ret.data };
//   } catch (e) {
//     return { error: "Error" };
//   }
// }
