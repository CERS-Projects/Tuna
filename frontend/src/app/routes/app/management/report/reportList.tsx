import { useEffect, useMemo, useRef, useState } from "react";
import {
  useReports,
  useDeleteReport,
} from "@/features/management/hooks/useReports";
import { ReportTable } from "@/features/management/components/reportTable/reportTable";
import { Pagination } from "@/features/management/components/pagination/pagination";
import { DeleteConfirmModal } from "@/features/management/components/deleteConfirmModal/deleteConfirmModal";
import {
  reasonLabels,
  type ReportType,
} from "@/features/management/types/report";
import type { ModalHandle } from "@/components/ui/modal/modal";
import styles from "@/features/management/style/reportList.module.css";
import { Spinner } from "@/components/ui/spinner/spinner";
const ITEMS_PER_PAGE = 8;

const ReportList = () => {
  const [reasonFilter, setReasonFilter] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ReportType | null>(null);

  const modalRef = useRef<ModalHandle>(null);
  const { reportList: reports, isFetching, refetch } = useReports();
  const deleteReport = useDeleteReport();

  // 初回データ取得
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

  // 削除モーダルを開く
  const handleDelete = (reportId: string) => {
    const target = reports.find((r) => r.reportId === reportId) ?? null;
    setDeleteTarget(target);
    modalRef.current?.show();
  };

  // 削除確定
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteReport.mutate(deleteTarget.reportId, {
      onSuccess: () => {
        modalRef.current?.close();
        setDeleteTarget(null);
        refetch();
      },
    });
  };

  // 削除キャンセル
  const handleCancelDelete = () => {
    modalRef.current?.close();
    setDeleteTarget(null);
  };
  if (isFetching) {
    return <Spinner />;
  }

  if (reports.length === 0) {
    return (
      <div className={styles.contents}>
        <h2 className={styles.title}>通報一覧</h2>
        <div className={styles.noData}>該当データがありませんでした</div>
      </div>
    );
  }

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
        <Spinner />
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

      <DeleteConfirmModal
        ref={modalRef}
        report={deleteTarget}
        isPending={deleteReport.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ReportList;
