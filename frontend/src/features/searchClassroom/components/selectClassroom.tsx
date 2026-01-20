import styles from "./selectClassroom.module.css";
import { Link } from "react-router";
import type { Classroom } from "@/features/searchClassroom/types/SelectClassroom";

export const SelectClassroom = ({
  roomId,
  teacherName,
  roomName,
  description,
  latestUpdate,
}: Classroom) => {
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
            <small>{latestUpdate}</small>
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
