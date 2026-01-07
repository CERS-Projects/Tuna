import styles from "./selectClassroom.module.css";
import { Link } from "react-router";

type SelectClassroom = {
  roomId: number;
  teacherName: string;
  roomName: string;
  description: string;
  latest_update: string;
};

export const SelectClassroom = ({
  roomId,
  teacherName,
  roomName,
  description,
  latest_update,
}: SelectClassroom) => {
  return (
    <Link
      to={`${roomId}`}
      relative="path"
      className={styles.selectClassroomBox}
    >
      <div className={styles.selectClassroomLayout}>
        <div className={styles.selectClassroomContainer}>
          <div className={styles.classroomHeader}>
            <h3>{roomName}</h3>
            <small>{latest_update}</small>
          </div>

          <hr />

          <div className={styles.classroomExplanation}>
            <p>{description}</p>
            <p>作成者：{teacherName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
