import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./classroomCard.module.css";

export type ClassroomCardProps = {
  roomId: number;
  roomName: string;
  teacherName: string;
  latestUpdate: string;
  onDelete?: () => void;
  onClick?: () => void;
};

export const ClassroomCard = ({
  roomId,
  roomName,
  teacherName,
  latestUpdate,
  onDelete,
  onClick,
}: ClassroomCardProps) => {
  return (
    <div className={styles.card} role="group">
      <button
        type="button"
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        aria-label={`授業ルーム「${roomName}」を削除`}
      >
        <FaRegTrashAlt />
      </button>

      <button
        type="button"
        className={styles.body}
        onClick={onClick}
        aria-label={`授業ルーム「${roomName}」を開く`}
        data-room-id={roomId}
      >
        <div className={styles.title}>{roomName}</div>
        <div className={styles.underline} />
        <div className={styles.teacher}>{teacherName}</div>
        <div className={styles.date}>{latestUpdate}</div>
      </button>
    </div>
  );
};
