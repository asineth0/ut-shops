import { AxiosError } from "axios";
import { Buffer } from "buffer";

export const prettyError = (e: unknown): string => {
  return (
    (
      (e as AxiosError).response?.data as {
        error?: string;
      }
    )?.error || (e as Error).message
  );
};

export const fileToBase64 = async (file: File) => {
  const reader = new FileReader();
  const data: ArrayBuffer = await new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  });

  return Buffer.from(data).toString("base64");
};
