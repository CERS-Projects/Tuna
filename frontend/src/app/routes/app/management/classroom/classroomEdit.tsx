import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/classroom.module.css";

const ClassroomEdit = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const parsedRoomId = Number(roomId) || 0;

  useEffect(() => {
    if (!roomId || !Number.isFinite(parsedRoomId) || parsedRoomId <= 0) {
      navigate(paths.app.management.classroom.list.path, { replace: true });
    }
  }, [roomId, navigate, parsedRoomId]);

  return (
    <div className={styles.contentsContainer}>
      <h2 className={styles.sectionName}>授業ルーム編集</h2>
    </div>
  );
};

export default ClassroomEdit;
