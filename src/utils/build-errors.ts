import type { FieldErrors } from "react-hook-form";

export const buildErrors = (field: string, errors: FieldErrors) => {
  const error = errors[field];

  if (Array.isArray(error)) {
    return error
      .map((error) => error?.message)
      .filter(Boolean)
      .join(", ");
  }

  return error?.message;
};
