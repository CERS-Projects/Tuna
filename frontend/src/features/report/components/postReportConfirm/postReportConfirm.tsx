import { Button } from "@/components/ui/button/button";
import styles from "./postReportConfirm.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef, useEffect } from "react";

type Props = {
  reportRadioValue: string;
  reportTextValue: string;
  userId: number;
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
  userId,
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
      <dl className={styles.reportContainer}>
        <dt>ユーザー</dt>
        <dd>{userId}</dd>
        <dt>投稿内容</dt>
        <dd>{postContent}</dd>
        <dt>選択項目</dt>
        <dd>{reportRadioValue}</dd>
        <dt>詳細</dt>
        <dd>
          <div className={styles.reportText}>{reportTextValue}</div>
        </dd>
      </dl>
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
        height={"45%"}
        containerStyle={{
          backgroundColor: "#fff",
          maxHeight: "200px",
          minHeight: "170px",
          maxWidth: "500px",
          minWidth: "250px",
        }}
        ref={modalRef}
        onClick={onReturnToTimeline}
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
