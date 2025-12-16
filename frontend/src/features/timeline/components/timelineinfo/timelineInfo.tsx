import styles from "./timelineInfo.module.css";

type GroupInfo = {
  groupName: string;
  groupInfo: string;
};

export const TimelineInfo = ({ groupName, groupInfo }: GroupInfo) => {
  return (
    <div className={styles.timelineInfo}>
      <h3>{groupName}</h3>
      <p>{groupInfo}</p>
    </div>
  );
};
