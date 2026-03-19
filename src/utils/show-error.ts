import { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "react-hot-toast";

export const showError = (error: unknown, form?: UseFormReturn<any>) => {
  if (typeof error === "object" && form) {
    const errorData = error as Record<string, unknown>;
    if (errorData.message && typeof errorData.message === "string") {
      toast.error(errorData.message);
      return;
    }

    Object.entries(errorData).forEach(([key, value]) => {
      form.setError(key as string, {
        message: value as string,
      });
    });

    return;
  }

  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("Erro desconhecido");
};
