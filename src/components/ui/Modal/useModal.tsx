import { type FieldValues } from "react-hook-form";
import {
  useModalForm,
  type UseModalOptions as UseModalOptionsForm,
  type UseModalReturn as UseModalReturnForm,
} from "./useModalForm";
import {
  useModalNoForm,
  type UseModalOptions as UseModalOptionsNoForm,
  type UseModalReturn as UseModalReturnNoForm,
} from "./useModalNoForm";

export type OnSubmitReturnType<T extends FieldValues, C> = (
  data: T,
  reference: C | null
) => void | Promise<void>;

type UseModalOptionsUnion<C, T extends FieldValues> =
  | (UseModalOptionsForm<T, C> & { noForm?: false })
  | (UseModalOptionsNoForm<C> & { noForm: true })
  | (UseModalOptionsNoForm<C> & { noForm?: undefined });

export function useModal<T extends FieldValues, C>(
  options?: UseModalOptionsForm<T, C> & { noForm?: false }
): UseModalReturnForm<T, C>;

export function useModal<C>(
  options: UseModalOptionsNoForm<C> & { noForm: true }
): UseModalReturnNoForm<C>;

export function useModal<C>(
  options?: UseModalOptionsNoForm<C> & { noForm?: undefined }
): UseModalReturnNoForm<C>;

export function useModal<C, T extends FieldValues = FieldValues>(
  options?: UseModalOptionsUnion<C, T>
): UseModalReturnForm<T, C> | UseModalReturnNoForm<C> {
  if (!options || options.noForm === true) {
    return useModalNoForm<C>(
      (options || {}) as UseModalOptionsNoForm<C>
    ) as any;
  } else {
    return useModalForm<T, C>(options as UseModalOptionsForm<T, C>) as any;
  }
}
