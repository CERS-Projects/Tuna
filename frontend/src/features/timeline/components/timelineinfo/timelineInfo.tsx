import styles from "./timelineInfo.module.css";
import { type TreeType } from "@/features/management/types/group";

type Props = {
  group: TreeType;
  handleSelect: (id: number) => void;
};

export const TimelineInfo = ({ group, handleSelect }: Props) => {
  return (
    <button
      type="button"
      className={styles.timelineInfo}
      onClick={() => handleSelect(group.groupId)}
    >
      <h3>{group.groupName}</h3>
    </button>
  );
};
