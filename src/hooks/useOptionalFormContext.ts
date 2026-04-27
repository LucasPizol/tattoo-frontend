import { useFormContext, type UseFormReturn } from "react-hook-form";

/**
 * Returns the react-hook-form context when inside a FormProvider,
 * or null when there is none — avoiding the error that useFormContext throws.
 */
export function useOptionalFormContext(): UseFormReturn | null {
  try {
    const ctx = useFormContext();
    if (!ctx || !ctx.formState) return null;
    return ctx;
  } catch {
    return null;
  }
}
