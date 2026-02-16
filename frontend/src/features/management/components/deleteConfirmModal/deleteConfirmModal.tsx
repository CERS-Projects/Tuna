import { IoWarningOutline } from "react-icons/io5";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { reasonLabels, type ReportType } from "../../types/report";
import styles from "./deleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  ref: React.Ref<ModalHandle>;
  report: ReportType | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteConfirmModal = ({
  ref,
  report,
  isPending,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!report) return null;

  const reasonLabel = reasonLabels[report.reasonId]?.label ?? "不明";

  return (
    <Modal
      ref={ref}
      containerStyle={{
        width: "min(500px, 90vw)",
        height: "fit-content",
        backgroundColor: "#fff",
      }}
    >
      <div className={styles.confirmContainer}>
        <IoWarningOutline className={styles.warningIcon} aria-hidden="true" />
        <h3 className={styles.title}>この通報を削除しますか？</h3>
        <p className={styles.description}>
          この操作は取り消せません。以下の通報データが完全に削除されます。
        </p>

        <table className={styles.reportInfo}>
          <tbody>
            <tr>
              <th>通報者</th>
              <td>{report.reportByName}（@{report.reportByShowUserId}）</td>
            </tr>
            <tr>
              <th>通報対象</th>
              <td>{report.reportedName}（@{report.reportedShowUserId}）</td>
            </tr>
            <tr>
              <th>通報理由</th>
              <td>{reasonLabel}</td>
            </tr>
            <tr>
              <th>投稿内容</th>
              <td>{report.reportedPost}</td>
            </tr>
            {report.reportDetail && (
              <tr>
                <th>詳細</th>
                <td>{report.reportDetail}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isPending}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
