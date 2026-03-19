type ClassValue =
  | string
  | undefined
  | boolean
  | { [x: string]: boolean | undefined | null };

export const cn = (...classes: ClassValue[]) => {
  return classes
    .map((c) => {
      if (typeof c === "string") return c;

      if (typeof c === "object")
        return Object.entries(c)
          .map(([key, value]) => {
            if (!!value) return key;
            return "";
          })
          .join(" ");

      return "";
    })
    .join(" ");
};
