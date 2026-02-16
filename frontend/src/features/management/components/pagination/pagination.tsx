import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import styles from "./pagination.module.css";

type Props = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // 先頭付近
  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total);
  }
  // 末尾付近
  else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  }
  // 中間
  else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
};

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={styles.paginationContainer}>
      <span className={styles.pageInfo}>
        全 {totalItems} 件中 {startItem} - {endItem} 件を表示
      </span>
      <div className={styles.pageButtons}>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="前のページ">
          <IoChevronBack />
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""}`}
              onClick={() => onPageChange(page)}>
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="次のページ">
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
};
