import { countDescendantsGroups } from "@/features/management/utils/countDescendantsGroups";
import { GroupCard } from "@/features/management/components/groupCard/groupCard";
import styles from "@/features/management/style/groupList.module.css";
import { useOutletContext } from "react-router";
import { type GroupsOutletContext } from "@/features/management/layouts/groupShell/groupShell";

const GroupList = () => {
  const { currentGroup, selectGroup } = useOutletContext<GroupsOutletContext>();

  return (
    <>
      <div className={styles.currentGroup}>
        <h3 className={styles.groupName}>{currentGroup?.name}</h3>

        <hr />

        <ul className={styles.groupDetail}>
          <li>{`${currentGroup?.member ?? 0} members`}</li>
          <li>{`${countDescendantsGroups(
            currentGroup?.branch
          )} sub-groups`}</li>
        </ul>
      </div>
      <div className={styles.subGroupsContainer}>
        <h3>サブグループ</h3>
        <div className={styles.subGroups}>
          {currentGroup?.branch?.map((item) => (
            <GroupCard
              key={item.id}
              name={item.name}
              member={item.member}
              subGroups={countDescendantsGroups(item.branch)}
              handleSelectGroup={() => selectGroup(item.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupList;
