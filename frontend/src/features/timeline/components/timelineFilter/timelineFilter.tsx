import { type TreeType } from "@/features/management/types/group";
import { TimelineInfo } from "../timelineinfo/timelineInfo";
import styles from "./timelineFilter.module.css";
import { useGroupNavigation } from "@/features/management/hooks/useGroupNavigation";
import { Breadcrumbs } from "@/features/management/components/breadcrumbs/breadcrumbs";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

export const TimelineFilter = ({ groups }: { groups: TreeType[] }) => {
  const { breadcrumbs, currentGroup } = useGroupNavigation([
    {
      groupId: 0,
      groupName: "グローバル",
      branchGroups: groups,
    },
  ]);

  const navigate = useNavigate();
  const handleSelect = (id: number) => {
    if (id === 0) {
      navigate(paths.app.timeline.getHref());
    } else {
      navigate(paths.app.timeline.getHref(id));
    }
  };

  return (
    <div className={styles.timelineFilter}>
      <div className={styles.navigateWrapper}>
        <Breadcrumbs breadcrumbs={breadcrumbs} handleSelect={handleSelect} />

        <h2>{currentGroup ? currentGroup.groupName : "グローバル"}</h2>
      </div>

      <hr />

      <div className={styles.filterCardContainer}>
        {currentGroup?.branchGroups &&
          currentGroup.branchGroups.map((item) => (
            <TimelineInfo
              key={item.groupId}
              group={item}
              handleSelect={handleSelect}
            />
          ))}
      </div>
    </div>
  );
};
