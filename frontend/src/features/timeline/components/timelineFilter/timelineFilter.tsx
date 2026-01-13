import { TimelineInfo } from "../timelineinfo/timelineInfo";
import styles from "./timelineFilter.module.css";

type TimelineGroup = {
  parentId: number;
  groupId: number;
  groupName: string;
  groupInfo: string;
};

const infoDummy: TimelineGroup[] = [
  {
    parentId: 1,
    groupId: 1,
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    parentId: 1,
    groupId: 2,
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    parentId: 1,
    groupId: 3,
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    parentId: 1,
    groupId: 4,
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
];

export const TimelineFilter = () => {
  return (
    <div className={styles.timelineFilter}>
      {/*divとh2はデータをのちに追加する*/}
      <div>aaaaaaaa</div>
      <h2>aaaaaaa</h2>

      <hr />
      <div className={styles.filterCard}>
        {infoDummy.map((item) => (
          <TimelineInfo key={item.groupId} {...item} />
        ))}
      </div>
    </div>
  );
};
