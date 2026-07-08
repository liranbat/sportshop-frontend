import type { AxiosRequestConfig } from "axios";
import type { ZodType } from "zod";
import { api } from "@/lib/api";

export async function getParsed<T>(
  url: string,
  schema: ZodType<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.get<unknown>(url, config);
  return schema.parse(data);
}

export async function postParsed<T>(
  url: string,
  body: unknown,
  schema: ZodType<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.post<unknown>(url, body, config);
  return schema.parse(data);
}

export async function putParsed<T>(
  url: string,
  body: unknown,
  schema: ZodType<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.put<unknown>(url, body, config);
  return schema.parse(data);
}

export async function patchParsed<T>(
  url: string,
  body: unknown,
  schema: ZodType<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.patch<unknown>(url, body, config);
  return schema.parse(data);
}

export async function deleteParsed<T>(
  url: string,
  schema: ZodType<T>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.delete<unknown>(url, config);
  return schema.parse(data);
}

export async function postVoid(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<void> {
  await api.post(url, body, config);
}

export async function putVoid(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<void> {
  await api.put(url, body, config);
}

export async function patchVoid(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<void> {
  await api.patch(url, body, config);
}

export async function deleteVoid(url: string, config?: AxiosRequestConfig): Promise<void> {
  await api.delete(url, config);
}
