import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Select } from "../Select";
import styles from "./styles.module.scss";

const SHOW_PAGES = 7;

type PaginationData = {
  page: number;
  totalPages: number;
  perPage: number;
};

type PaginationProps = {
  pagination: PaginationData;
  onChange: (page: number, perPage: number) => void;
  className?: string;
  initialLoading?: boolean;
};

export const Pagination = ({
  pagination,
  onChange,
  className,
}: PaginationProps) => {
  const { page, totalPages, perPage } = pagination;

  const createPagination = useMemo(() => {
    if (totalPages <= 0) return [];

    const pagesAmount = totalPages;
    const currentPage = Math.min(Math.max(page, 1), pagesAmount);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const maxPages = isMobile ? 5 : SHOW_PAGES;

    // Se o total de páginas é menor ou igual ao máximo, mostra tudo
    if (pagesAmount <= maxPages) {
      return Array.from({ length: pagesAmount }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    const half = isMobile ? 1 : 2;
    let startPage = currentPage - half;
    let endPage = currentPage + half;

    // Ajuste para número par de páginas visíveis
    if (maxPages % 2 === 0) {
      endPage -= 1;
    }

    if (startPage < 1) {
      endPage += 1 - startPage;
      startPage = 1;
    }

    if (endPage > pagesAmount) {
      startPage -= endPage - pagesAmount;
      endPage = pagesAmount;
      if (startPage < 1) startPage = 1;
    }

    // Primeira página e reticências à esquerda
    if (endPage > pagesAmount) {
      endPage = pagesAmount;
      startPage = Math.max(1, endPage - (maxPages - 1));
    }

    if (startPage > 1) {
      pages.push(1);

      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage ?? 1; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < pagesAmount) {
      if (endPage < pagesAmount - 1) {
        pages.push("...");
      }
      pages.push(pagesAmount);
    }

    return pages;
  }, [totalPages, page]);

  return (
    <div className={cn(styles.pagination, className)}>
      <Select
        noForm
        value={perPage}
        options={[
          { label: "10 itens por página", value: 10 },
          { label: "20 itens por página", value: 20 },
          { label: "50 itens por página", value: 50 },
          { label: "100 itens por página", value: 100 },
        ]}
        onSelect={({ value }) => onChange(page, Number(value))}
        containerClassName={styles.paginationSelect}
      />

      <div className={styles.paginationControls}>
        <button
          className={styles.paginationButton}
          disabled={page === 1}
          onClick={() => onChange(page - 1, perPage)}
        >
          <MdArrowForwardIos
            size={16}
            style={{ transform: "rotate(180deg)" }}
          />
        </button>

        {createPagination?.map((pageNumber, index) => (
          <button
            key={pageNumber === "..." ? `page-${index}` : String(pageNumber)}
            className={cn(styles.paginationButton, {
              [styles.active]: page === pageNumber,
            })}
            disabled={page === pageNumber || pageNumber === "..."}
            onClick={() => onChange(Number(pageNumber), perPage)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className={styles.paginationButton}
          disabled={page === totalPages}
          onClick={() => onChange(page + 1, perPage)}
        >
          <MdArrowForwardIos size={16} />
        </button>
      </div>
    </div>
  );
};
