import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdExpandLess,
  MdExpandMore,
  MdKeyboardArrowDown,
  MdSearch,
} from "react-icons/md";
import { Tag } from "../Tag";
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
  label?: string;
  size?: "small" | "medium" | "large";
  canOpenDisabled?: boolean;
  canSelectRoot?: boolean;
  onClear?: () => void;
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
  size = "medium",
  label,
  canOpenDisabled = false,
  canSelectRoot = false,
  onClear,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (values) {
      const findNode = (nodes: TreeNode[]): TreeNode | null => {
        for (const node of nodes) {
          if (
            node.id.toString() ===
            values.find((v) => v.id === node.id)?.id.toString()
          )
            return node;
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
    const newExpandedKeys = new Set(expandedKeys);
    if (newExpandedKeys.has(nodeId)) {
      newExpandedKeys.delete(nodeId);
    } else {
      newExpandedKeys.add(nodeId);
    }
    setExpandedKeys(newExpandedKeys);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    if (disabled && !canOpenDisabled) return;

    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      setTimeout(updateDropdownPosition, 0);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClose);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("click", handleClose);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

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
          <div className={styles.searchWrapper}>
            <MdSearch size={16} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className={styles.treeContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((node) => renderTreeNode(node))
          ) : (
            <div className={styles.emptyText}>Nenhum resultado encontrado</div>
          )}
        </div>
      </div>,
      document.querySelector("#modal-root") as HTMLElement,
    );
  };

  const handleSelect = (node: TreeNode) => {
    if (node.disabled || node.selectable === false) return;

    setSelectedNode(node);
    onChange?.({
      id: node.id,
      title: node.title,
    });
    setSearchValue("");
  };

  const handleClear = () => {
    setSelectedNode(null);
    onClear?.();
    setSearchValue("");
  };

  const filteredData = React.useMemo(() => {
    if (!searchValue) return data;

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const matchesSearch = node.title
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          const children = node.children ? filterNodes(node.children) : [];

          if (matchesSearch || children.length > 0) {
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
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const isDisabled = node.disabled || node.selectable === false;

    return (
      <div key={node.id} className={styles.treeNode}>
        <div
          className={cn(styles.treeNodeContent, {
            [styles.selected]: isSelected,
            [styles.disabled]: isDisabled,
            [styles.hovered]: !isDisabled && !canOpenDisabled,
          })}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (hasChildren && !canSelectRoot) {
              toggleExpanded(node.id);
              return;
            }
            handleSelect(node);
          }}
        >
          <div className={styles.treeNodeLeft}>
            {hasChildren && (
              <button
                type="button"
                className={cn(styles.expandButton, {
                  [styles.expanded]: isExpanded,
                  [styles.disabled]: isDisabled && !canOpenDisabled,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(node.id);
                }}
                disabled={isDisabled && !canOpenDisabled}
              >
                {isExpanded ? (
                  <MdExpandLess size={14} />
                ) : (
                  <MdExpandMore size={14} />
                )}
              </button>
            )}
            <span className={styles.treeNodeTitle}>{node.title}</span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.treeNodeChildren}>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={selectRef}
      className={cn(styles.container, className, {
        [styles.disabled]: disabled,
        [styles.open]: isOpen,
        [styles.small]: size === "small",
        [styles.large]: size === "large",
      })}
    >
      {/* {label && <label className={styles.label}>{label}</label>} */}
      <div
        className={styles.selector}
        onClick={handleToggle}
        tabIndex={0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e as any);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        <div className={styles.selectorValue}>
          {values && values.length > 0 ? (
            values.map((v) => (
              <Tag
                key={v.id}
                color="blue"
                size="medium"
                onRemove={() => {
                  onChange?.({
                    id: v.id,
                    title: v.title,
                  });
                }}
              >
                {v.title}
              </Tag>
            ))
          ) : selectedNode ? (
            <span className={styles.selectedValue}>{selectedNode.title}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>

        <div className={styles.selectorSuffix}>
          {allowClear && selectedNode && (
            <button
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ×
            </button>
          )}
          <MdKeyboardArrowDown
            size={16}
            className={cn(styles.arrow, { [styles.arrowUp]: isOpen })}
          />
        </div>
      </div>
      {renderDropdown()}
    </div>
  );
};
