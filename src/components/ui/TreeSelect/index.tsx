import { cn } from "@/utils/cn";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdClose,
  MdExpandLess,
  MdExpandMore,
  MdKeyboardArrowDown,
  MdSearch,
} from "react-icons/md";
import { Input } from "../Input";
import { Label } from "../Label";
import { Tag } from "../Tag";
import { Visible } from "../../Visible";
import styles from "./styles.module.scss";

export interface TreeNode {
  id: number;
  title: string;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
}

interface TreeSelectProps {
  values?: { id: number; title: string }[];
  onChange?: (value: TreeNode) => void;
  placeholder?: string;
  data: TreeNode[];
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  size?: "small" | "medium" | "large";
  canOpenDisabled?: boolean;
  canSelectRoot?: boolean;
  onClear?: () => void;
  noResultsText?: string;
  searchPlaceholder?: string;
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
  values,
  onChange,
  placeholder = "Selecione um item",
  data,
  className,
  disabled = false,
  allowClear = true,
  showSearch = true,
  label,
  required,
  error,
  canOpenDisabled = false,
  canSelectRoot = false,
  onClear,
  noResultsText = "Nenhum resultado encontrado",
  searchPlaceholder = "Buscar...",
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (values && values.length > 0) {
      const findNode = (nodes: TreeNode[]): TreeNode | null => {
        for (const node of nodes) {
          if (values.some((v) => v.id === node.id)) return node;
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      setSelectedNode(findNode(data));
    } else {
      setSelectedNode(null);
    }
  }, [values, data]);

  const toggleExpanded = (nodeId: number) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled && !canOpenDisabled) return;
    e.stopPropagation();
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setTimeout(() => {
        updateDropdownPosition();
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("click", handleClose);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    return () => {
      document.removeEventListener("click", handleClose);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  const handleSelect = (node: TreeNode) => {
    if (node.disabled || node.selectable === false) return;
    setSelectedNode(node);
    onChange?.({ id: node.id, title: node.title });
    setSearchValue("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(null);
    onClear?.();
    setSearchValue("");
  };

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    const term = searchValue.toLowerCase();
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const matches = node.title.toLowerCase().includes(term);
          const children = node.children ? filterNodes(node.children) : [];
          if (matches || children.length > 0) {
            return {
              ...node,
              children: children.length > 0 ? children : undefined,
            };
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    };
    return filterNodes(data);
  }, [data, searchValue]);

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = !!node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.id);
    const isSelected =
      selectedNode?.id === node.id ||
      (values?.some((v) => v.id === node.id) ?? false);
    const isDisabled = node.disabled || node.selectable === false;

    return (
      <div key={node.id} className={styles.treeNode}>
        <div
          className={cn(styles.option, {
            [styles.option_selected]: isSelected,
            [styles.option_disabled]: isDisabled,
          })}
          style={{ paddingLeft: `${level * 16 + 10}px` }}
          onClick={() => {
            if (hasChildren && !canSelectRoot) {
              toggleExpanded(node.id);
              return;
            }
            handleSelect(node);
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              className={cn(styles.expandButton, {
                [styles.expanded]: isExpanded,
              })}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
              disabled={isDisabled && !canOpenDisabled}
              aria-label={isExpanded ? "Recolher" : "Expandir"}
            >
              {isExpanded ? (
                <MdExpandLess size={16} />
              ) : (
                <MdExpandMore size={16} />
              )}
            </button>
          ) : (
            <span className={styles.expandSpacer} aria-hidden="true" />
          )}
          <span className={styles.treeNodeTitle}>{node.title}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.treeNodeChildren}>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDropdown = () => {
    if (!isOpen) return null;
    const root = document.querySelector("#modal-root") as HTMLElement | null;
    if (!root) return null;

    return createPortal(
      <div
        className={styles.dropdownContent}
        style={{
          position: "absolute",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showSearch && (
          <Input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) =>
              setSearchValue((e.target as HTMLInputElement).value)
            }
            prefixIcon={<MdSearch size={16} className={styles.searchIcon} />}
            onClick={(e) => e.stopPropagation()}
            noForm
          />
        )}

        <div className={styles.treeContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((node) => renderTreeNode(node))
          ) : (
            <div className={styles.noResults}>{noResultsText}</div>
          )}
        </div>
      </div>,
      root,
    );
  };

  const hasMultiValues = !!values && values.length > 0;

  return (
    <div
      className={cn(styles.select, className, {
        [styles.error]: !!error,
        [styles.disabled]: disabled,
      })}
    >
      {label && (
        <Label required={required} disabled={disabled} error={!!error}>
          {label}
        </Label>
      )}

      <div
        ref={selectRef}
        className={cn(styles.selectContainer, {
          [styles.selectContainer_open]: isOpen,
        })}
        onClick={handleToggle}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e);
          } else if (e.key === "Escape") {
            handleClose();
          }
        }}
      >
        <div className={styles.selectContent}>
          {hasMultiValues ? (
            <div className={styles.tagsContainer}>
              {values!.map((v) => (
                <Tag
                  key={v.id}
                  size="small"
                  onRemove={() => onChange?.({ id: v.id, title: v.title })}
                >
                  {v.title}
                </Tag>
              ))}
            </div>
          ) : selectedNode ? (
            <span className={styles.selectedValue}>{selectedNode.title}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>

        <Visible
          condition={allowClear && (!!selectedNode || hasMultiValues) && !disabled}
        >
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Limpar seleção"
          >
            <MdClose size={16} />
          </button>
        </Visible>

        <span
          className={cn(styles.arrow, { [styles.arrowOpen]: isOpen })}
          aria-hidden="true"
        >
          <MdKeyboardArrowDown size={18} />
        </span>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {renderDropdown()}
    </div>
  );
};
