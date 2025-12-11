import { TimelineInfo } from "../timelineinfo/timelineInfo";
import styles from "./timelineFilter.module.css";

type timelineGroup = {
  groupName: string;
  groupInfo: string;
};

const infoDummy: timelineGroup[] = [
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
    groupName: "グループ4",
    groupInfo: "これはグループ4の情報です。",
  },
  {
    groupName: "グループ1",
    groupInfo: "これはグループ1の情報です。",
  },
  {
    groupName: "グループ2",
    groupInfo: "これはグループ2の情報です。",
  },
  {
    groupName: "グループ3",
    groupInfo: "これはグループ3の情報です。",
  },
  {
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
          <TimelineInfo groupInfo={item.groupInfo} groupName={item.groupName} />
        ))}
      </div>
    </div>
  );
};
