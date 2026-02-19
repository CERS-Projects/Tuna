import { useState } from "react";
import { BsExclamationTriangle, BsCheckCircle } from "react-icons/bs";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { reasonLabels } from "../../types/report";
import { useCreateReport } from "../../hooks/useCreateReport";
import styles from "./reportCreateModal.module.css";

type ReportTarget = {
  postId: string;
  userId: number;
  nickname: string;
  showUserId: string;
  icon?: string;
};

type ReportCreateModalProps = {
  ref: React.Ref<ModalHandle>;
  target: ReportTarget | null;
  onClose: () => void;
};

export const ReportCreateModal = ({
  ref,
  target,
  onClose,
}: ReportCreateModalProps) => {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState<{ reason?: string; detail?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending } = useCreateReport();

  const resetForm = () => {
    setSelectedReason(null);
    setDetail("");
    setErrors({});
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: { reason?: string; detail?: string } = {};

    if (!selectedReason) {
      newErrors.reason = "通報理由を選択してください";
    }
    if (!detail.trim()) {
      newErrors.detail = "詳細を入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!target || !validate()) return;

    mutate(
      {
        reportedUser: target.userId,
        reasonId: selectedReason!,
        detail: detail.trim(),
        reportedPostId: target.postId,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: () => {
          setErrors({ detail: "通報の送信に失敗しました。もう一度お試しください。" });
        },
      },
    );
  };

  if (!target) return null;

  return (
    <Modal
      ref={ref}
      containerStyle={{
        width: "min(480px, 90vw)",
        height: "fit-content",
        maxHeight: "85vh",
        backgroundColor: "#fff",
      }}
    >
      {isSuccess ? (
        <div className={styles.successMessage}>
          <BsCheckCircle className={styles.successIcon} aria-hidden="true" />
          <p className={styles.successText}>通報を送信しました</p>
          <p className={styles.successSubText}>
            ご報告ありがとうございます。管理者が確認いたします。
          </p>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleClose}
          >
            閉じる
          </button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <BsExclamationTriangle
            style={{ fontSize: "2rem", color: "#f59e0b", alignSelf: "center" }}
            aria-hidden="true"
          />
          <h3 className={styles.title}>投稿を通報する</h3>
          <p className={styles.description}>
            不適切と思われる投稿を管理者に報告します。
          </p>

          <div className={styles.targetInfo}>
            {target.icon && (
              <img
                src={target.icon}
                alt=""
                className={styles.targetIcon}
              />
            )}
            <span className={styles.targetName}>{target.nickname}</span>
            <span className={styles.targetId}>@{target.showUserId}</span>
          </div>

          <div className={styles.formGroup}>
            <span className={styles.label}>
              通報理由<span className={styles.required}>*</span>
            </span>
            <ul className={styles.reasonList}>
              {Object.entries(reasonLabels).map(([id, reason]) => {
                const reasonId = Number(id);
                const isSelected = selectedReason === reasonId;
                return (
                  <li
                    key={id}
                    className={
                      isSelected
                        ? styles.reasonItemSelected
                        : styles.reasonItem
                    }
                    onClick={() => {
                      setSelectedReason(reasonId);
                      setErrors((prev) => ({ ...prev, reason: undefined }));
                    }}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      className={styles.reasonRadio}
                      checked={isSelected}
                      onChange={() => setSelectedReason(reasonId)}
                    />
                    <span
                      className={styles.reasonLabel}
                      style={{
                        backgroundColor: reason.color,
                        color: reason.textColor,
                      }}
                    >
                      {reason.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            {errors.reason && (
              <p className={styles.errorMessage}>{errors.reason}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reportDetail" className={styles.label}>
              詳細<span className={styles.required}>*</span>
            </label>
            <textarea
              id="reportDetail"
              className={
                errors.detail
                  ? styles.detailTextareaError
                  : styles.detailTextarea
              }
              placeholder="具体的な内容を記入してください"
              value={detail}
              onChange={(e) => {
                setDetail(e.target.value);
                setErrors((prev) => ({ ...prev, detail: undefined }));
              }}
              maxLength={500}
            />
            {errors.detail && (
              <p className={styles.errorMessage}>{errors.detail}</p>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
              disabled={isPending}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "送信中..." : "通報する"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
