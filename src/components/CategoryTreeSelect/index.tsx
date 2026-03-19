import { useTagList } from "@/features/tags/hooks/useTagList";
import type { Tag } from "@/services/requests/tags/types";
import { useMemo } from "react";
import { TreeSelect, type TreeNode } from "../ui/TreeSelect";

type Props = {
  values: { id: number; title: string }[];
  onChange: (value: Tag | null, newList: { id: number; title: string }[]) => void;
  tag: Tag | null;
  placeholder?: string;
  disabledIds?: number[];
  canOpenDisabled?: boolean;
  onClear?: () => void;
  canSelectRoot?: boolean;
};

export const CategoryTreeSelect = ({
  values,
  onChange,
  tag,
  placeholder,
  disabledIds,
  canOpenDisabled = false,
  canSelectRoot = false,
  onClear,
}: Props) => {
  const { data } = useTagList();

  const disableIds = useMemo((): number[] => {
    if (disabledIds) return disabledIds;
    if (!tag) return [];
    const ids = tag.children.map((child) => child.id);
    ids.push(tag.id);
    return ids;
  }, [tag, disabledIds]);

  const buildTree = (tags: Tag[]): TreeNode[] => {
    return tags.map((t) => ({
      id: t.id,
      title: t.name,
      disabled: disableIds.includes(t.id),
      children: buildTree(t.children),
    }));
  };

  return (
    <TreeSelect
      label="Selecione uma tag"
      placeholder={placeholder}
      values={values}
      data={buildTree(data || [])}
      canOpenDisabled={canOpenDisabled}
      canSelectRoot={canSelectRoot}
      onChange={(value) => {
        const hasValue = values.find((v) => v.id === value.id);
        if (hasValue) {
          onChange(null, values.filter((v) => v.id !== value.id));
          return;
        }
        onChange(value as unknown as Tag, [...values, value]);
      }}
      onClear={onClear}
    />
  );
};
