import { cn } from "@/utils/cn";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineSearchOff,
} from "react-icons/md";
import { Loading } from "../Loading";
import { Pagination } from "../Pagination";
import styles from "./styles.module.scss";

// ============================================================================
// TYPES
// ============================================================================

export type SortableOrder = "asc" | "desc" | undefined;

type DefaultColumn = object & {
  id: string | number;
};

export type Column<T extends DefaultColumn> = {
  key: keyof T | (string & {});
  label?: string;
  render?: (data: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  padding?: string | number;
  hideOnMobile?: boolean;
  onSort?: (key: string, order: SortableOrder) => void;
};

type TableProps<T extends DefaultColumn> = {
  columns: Array<Column<T>>;
  data: Array<T>;
  maxHeight?: string;
  className?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    perPage: number;
    totalPages: number | undefined;
    onChange: (page: number, perPage: number) => void;
  };
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

type SortIconsProps = {
  sortOrder: SortableOrder;
};

const SortIcons = ({ sortOrder }: SortIconsProps) => (
  <span className={styles.sortIcons}>
    <MdKeyboardArrowUp
      size={16}
      className={cn(styles.sortIcon, styles.sortIconUp, {
        [styles.active]: sortOrder === "asc",
      })}
    />
    <MdKeyboardArrowDown
      size={16}
      className={cn(styles.sortIcon, styles.sortIconDown, {
        [styles.active]: sortOrder === "desc",
      })}
    />
  </span>
);

type HeaderCellProps<T extends DefaultColumn> = {
  column: Column<T>;
  sortOrder: SortableOrder;
  onSortClick: () => void;
};

const HeaderCell = <T extends DefaultColumn>({
  column,
  sortOrder,
  onSortClick,
}: HeaderCellProps<T>) => {
  const isSortable = !!column.onSort;
  const label = column.label || String(column.key);

  return (
    <div
      className={cn(styles.headerCell, styles[column.align || "left"], {
        [styles.sortable]: isSortable,
      })}
      style={{ padding: column.padding || undefined }}
      onClick={isSortable ? onSortClick : undefined}
    >
      {isSortable ? (
        <span className={styles.sortableContent}>
          <SortIcons sortOrder={sortOrder} />
          {label}
        </span>
      ) : (
        label
      )}
    </div>
  );
};

type TableHeaderProps<T extends DefaultColumn> = {
  columns: Array<Column<T>>;
  sortedColumns: Record<string, SortableOrder>;
  onSort: (
    key: string,
    sortFn: (key: string, order: SortableOrder) => void,
  ) => void;
};

const TableHeader = <T extends DefaultColumn>({
  columns,
  sortedColumns,
  onSort,
}: Omit<TableHeaderProps<T>, "gridTemplateColumns">) => (
  <div className={styles.header}>
    <div className={styles.headerRow}>
      {columns.map((column) => (
        <HeaderCell
          key={String(column.key)}
          column={column}
          sortOrder={sortedColumns[column.key as string]}
          onSortClick={() =>
            column.onSort && onSort(String(column.key), column.onSort)
          }
        />
      ))}
    </div>
  </div>
);

type BodyCellProps<T extends DefaultColumn> = {
  column: Column<T>;
  row: T;
};

const BodyCell = <T extends DefaultColumn>({
  column,
  row,
}: BodyCellProps<T>) => {
  const content = column.render
    ? column.render(row)
    : (row[column.key as keyof T] as ReactNode);

  return (
    <div
      className={cn(styles.bodyCell, styles[column.align || "left"])}
      style={{ padding: column.padding || undefined }}
    >
      {content}
    </div>
  );
};

type StateProps = {
  colSpan: number;
};

const EmptyState = ({ colSpan }: StateProps) => (
  <div
    className={styles.emptyContainer}
    style={{ gridColumn: `span ${colSpan}` }}
  >
    <div className={styles.emptyContent}>
      <div className={styles.emptyIcon}>
        <MdOutlineSearchOff size={22} />
      </div>
      <span className={styles.emptyLabel}>Nenhum dado encontrado</span>
    </div>
  </div>
);

const LoadingState = ({ colSpan }: StateProps) => (
  <div
    className={styles.emptyContainer}
    style={{ gridColumn: `span ${colSpan}` }}
  >
    <div className={styles.emptyContent}>
      <Loading size={32} />
    </div>
  </div>
);

// ============================================================================
// HOOKS
// ============================================================================

function useHorizontalScroll(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (ref.current) {
        setHasScroll(ref.current.scrollWidth > ref.current.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, deps);

  return { ref, hasScroll };
}

function useVisibleColumns<T extends DefaultColumn>(columns: Array<Column<T>>) {
  return useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return columns.filter((col) => !col.hideOnMobile);
    }
    return columns;
  }, [columns]);
}

function useGridTemplate<T extends DefaultColumn>(columns: Array<Column<T>>) {
  return useMemo(() => {
    return columns
      .map((column) => {
        const { width, minWidth, maxWidth } = column;

        // Colunas com width "auto" ou "fit-content" usam max-content
        if (width === "auto" || width === "fit-content") {
          return "max-content";
        }

        // Width fixo (ex: "200px", "10rem")
        if (width) {
          return width;
        }

        // Com maxWidth definido, limita o crescimento
        if (maxWidth) {
          return `minmax(${minWidth || "100px"}, ${maxWidth})`;
        }

        // Padrão: coluna flexível que cresce
        return `minmax(${minWidth || "100px"}, 1fr)`;
      })
      .join(" ");
  }, [columns]);
}

function useSorting() {
  const [sortedColumns, setSortedColumns] = useState<
    Record<string, SortableOrder>
  >({});

  const handleSort = useCallback(
    (key: string, onSort: (key: string, order: SortableOrder) => void) => {
      const currentOrder = sortedColumns[key];
      const nextOrder: SortableOrder = !currentOrder
        ? "asc"
        : currentOrder === "asc"
          ? "desc"
          : undefined;

      setSortedColumns({ [key]: nextOrder });
      onSort(key, nextOrder);
    },
    [sortedColumns],
  );

  return { sortedColumns, handleSort };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TableInner = <T extends DefaultColumn>({
  columns,
  data,
  className,
  loading = false,
  onRowClick,
  pagination,
}: TableProps<T>) => {
  const visibleColumns = useVisibleColumns(columns);
  const gridTemplateColumns = useGridTemplate(visibleColumns);
  const { sortedColumns, handleSort } = useSorting();
  const { ref: wrapperRef, hasScroll } = useHorizontalScroll([data, columns]);
  const [height, setHeight] = useState(0);

  const isEmpty = data.length === 0 && !loading;

  const renderRow = useCallback(
    (row: T) => (
      <div
        key={row.id}
        className={cn(styles.bodyRow, { [styles.clickable]: !!onRowClick })}
        onClick={() => onRowClick?.(row)}
      >
        {visibleColumns.map((column) => (
          <BodyCell
            key={`${row.id}-${String(column.key)}`}
            column={column}
            row={row}
          />
        ))}
      </div>
    ),
    [visibleColumns, onRowClick],
  );

  const paginationConfig = pagination && {
    page: pagination.page,
    totalPages: pagination.totalPages || 0,
    perPage: pagination.perPage,
  };

  useEffect(() => {
    if (loading || height > 0) return;

    if (wrapperRef.current && data.length > 0) {
      setHeight(wrapperRef.current.clientHeight);
    } else if (data.length === 0) {
      setHeight(0);
    }
  }, [data, loading]);

  return (
    <>
      {pagination && (
        <Pagination
          pagination={paginationConfig!}
          onChange={(page, perPage) => {
            setHeight(0);
            pagination.onChange(page, perPage);
          }}
          className={styles.pagination}
        />
      )}
      <div className={cn(styles.container, className)}>
        <div
          ref={wrapperRef}
          className={cn(styles.wrapper, { [styles.hasScroll]: hasScroll })}
          style={{
            minHeight: height,
          }}
        >
          <div className={styles.table} style={{ gridTemplateColumns }}>
            <TableHeader
              columns={visibleColumns}
              sortedColumns={sortedColumns}
              onSort={handleSort}
            />

            <div className={styles.body}>
              {loading && <LoadingState colSpan={visibleColumns.length} />}
              {isEmpty && <EmptyState colSpan={visibleColumns.length} />}
              {!loading && !isEmpty && data.map((row) => renderRow(row as T))}
            </div>
          </div>
        </div>

        {!isEmpty && pagination && (
          <div className={styles.paginationStrip}>
            <Pagination
              pagination={paginationConfig!}
              onChange={(page, perPage) => {
                setHeight(0);
                pagination.onChange(page, perPage);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

// Type assertion to preserve generics with memo
export const Table = memo(TableInner) as typeof TableInner;
