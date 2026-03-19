import { useMemo } from "react";
import { useSearchParams, type URLSearchParamsInit } from "react-router-dom";

export const useCustomParams = <T>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const setParams = (
    params: T extends Record<string, unknown> ? Record<string, unknown> : never,
  ) => {
    const paramsWithoutUndefined = Object.entries(params).filter(
      ([_, value]) => !!value,
    );
    const paramsToSet = Object.fromEntries(paramsWithoutUndefined);

    setSearchParams(paramsToSet as unknown as URLSearchParamsInit);
  };

  return [params, setParams] as [
    T,
    (
      params: T extends Record<string, unknown>
        ? Record<string, unknown>
        : never,
    ) => void,
  ];
};
