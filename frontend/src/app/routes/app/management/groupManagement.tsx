import { Fragment } from "react";
import { useGroups } from "@/features/management/hooks/useGroups";
import { useGroupNavigation } from "@/features/management/hooks/useGroupNavigation";
import { countDescendantsGroups } from "@/features/management/utils/countDescendantsGroups";
import { Tree } from "@/features/management/components/tree/tree";
import { GroupCard } from "@/features/management/components/groupCard/groupCard";
import { FaPen, FaPlus } from "react-icons/fa";
import styles from "@/features/management/style/groupManagement.module.css";

const GroupManagement = () => {
  const { groups, isFetching, isError } = useGroups();
  const { breadcrumbs, currentGroup, selectGroup } = useGroupNavigation(groups);

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionName}>グループ一覧</h2>

      <header className={styles.menuContainer}>
        <nav className={styles.breadcrumbsContainer}>
          <ul className={styles.breadcrumbs}>
            {breadcrumbs.map((item, index) => (
              <Fragment key={`${item.id}`}>
                <li onClick={() => selectGroup(item.id)}>{item.crumb}</li>
                {index !== breadcrumbs.length - 1 && "/"}
              </Fragment>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <button>
            <FaPen />
            グループ編集
          </button>
          <button>
            <FaPlus />
            グループ作成
          </button>
        </div>
      </header>

      <hr />

      <div className={styles.groupInfoContainer}>
        <aside className={styles.groupTree}>
          <Tree items={groups} level={0} handleBranchClick={selectGroup} />
        </aside>
        <div className={styles.groupInfo}>
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
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
