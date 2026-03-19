import { useCallback, useRef, useState } from "react";

export const useDebounce = () => {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onChangeDebounce = useCallback(
    async (onDebounce: () => Promise<void>) => {
      return new Promise<void>((resolve, reject) => {
        setIsDebouncing(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          try {
            await onDebounce();
            setIsDebouncing(false);
            resolve(undefined);
          } catch (error) {
            reject(error);
          }
        }, 500);
      });
    },
    []
  );

  return {
    isDebouncing,
    onChangeDebounce,
  };
};
