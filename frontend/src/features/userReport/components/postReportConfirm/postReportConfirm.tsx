import { Button } from "@/components/ui/button/button";
import styles from "./postReportConfirm.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef, useEffect } from "react";

type Props = {
  reportRadioValue: string;
  reportTextValue: string;
  userID: string;
  postContent: string;
  onConfirm: () => void;
  onBack: () => void;
  isCompleted: boolean;
  isLoading: boolean;
  onReturnToTimeline: () => void;
};

export const PostReportConfirm = ({
  reportRadioValue,
  reportTextValue,
  userID,
  postContent,
  onConfirm,
  onBack,
  isCompleted,
  isLoading,
  onReturnToTimeline,
}: Props) => {
  const modalRef = useRef<ModalHandle>(null);
  useEffect(() => {
    if (isCompleted) {
      modalRef.current?.show();
    }
  }, [isCompleted]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>通報内容の確認</div>
      <div className={styles.reportContainer}>
        <div className={styles.label}>ユーザー</div>
        <div className={styles.valueText}>{userID}</div>
        <div className={styles.label}>投稿内容</div>
        <div className={styles.valueText}>{postContent}</div>
        <div className={styles.label}>選択項目</div>
        <div className={styles.valueText}>{reportRadioValue}</div>
        <div className={styles.label}>詳細</div>
        <div className={styles.reportText}>{reportTextValue}</div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          onClick={onBack}
          width="80px"
          height="35px"
          fontSize="1rem"
          disabled={isLoading}
        >
          修正
        </Button>
        <Button
          onClick={onConfirm}
          width="80px"
          height="35px"
          fontSize="1rem"
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "通報"}
        </Button>
      </div>
      <Modal
        width={"90%"}
        height={"40%"}
        containerStyle={{
          backgroundColor: "#fff",
          maxHeight: "200px",
          minHeight: "170px",
          maxWidth: "500px",
          minWidth: "250px",
        }}
        onClose={onReturnToTimeline}
        ref={modalRef}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalTitle}>通報が完了しました</div>
          <div className={styles.modalText}>ご報告ありがとうございます</div>
          <Button
            onClick={onReturnToTimeline}
            width="90%"
            height="40px"
            fontSize="1.1rem"
          >
            タイムラインに戻る
          </Button>
        </div>
      </Modal>
    </div>
  );
};
