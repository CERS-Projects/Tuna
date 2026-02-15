import { useEffect, useMemo, useState } from "react";
import {
  useReports,
  useDeleteReport,
} from "@/features/management/hooks/useReports";
import { ReportTable } from "@/features/management/components/reportTable/reportTable";
import { Pagination } from "@/features/management/components/pagination/pagination";
import { reasonLabels } from "@/features/management/types/report";
import styles from "@/features/management/style/reportList.module.css";

const ITEMS_PER_PAGE = 5;

const ReportList = () => {
  const [reasonFilter, setReasonFilter] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState(1);

  const { reportList: reports, isFetching, refetch } = useReports();
  const deleteReport = useDeleteReport();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // 通報理由フィルタ
  const filtered = useMemo(() => {
    if (reasonFilter === -1) return reports;
    return reports.filter((r) => r.reasonId === reasonFilter);
  }, [reports, reasonFilter]);

  // ページネーション
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // フィルタ変更時にページを1に戻す
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReasonFilter(Number(e.target.value));
    setCurrentPage(1);
  };

  // 削除処理
  const handleDelete = (reportId: string) => {
    if (window.confirm("この通報を削除しますか？")) {
      deleteReport.mutate(reportId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  return (
    <div className={styles.contents}>
      <div className={styles.header}>
        <h2 className={styles.title}>通報一覧</h2>
        <div className={styles.filterWrapper}>
          <label htmlFor="reasonFilter" className={styles.filterLabel}>
            通報理由
          </label>
          <select
            id="reasonFilter"
            className={styles.filterSelect}
            value={reasonFilter}
            onChange={handleFilterChange}>
            <option value={-1}>すべて</option>
            {Object.entries(reasonLabels).map(([id, reason]) => (
              <option key={id} value={id}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFetching ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <>
          <ReportTable reports={paginatedReports} onDelete={handleDelete} />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ReportList;
