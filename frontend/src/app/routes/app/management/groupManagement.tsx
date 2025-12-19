import { useState, useEffect } from "react";
import { type Breadcrumb } from "@/features/management/types/breadcrumb";
import { Tree } from "@/features/management/components/tree/tree";
import { GroupCard } from "@/features/management/components/groupCard/groupCard";
import { FaPen, FaPlus } from "react-icons/fa";
import styles from "@/features/management/style/groupManagement.module.css";
import { type TreeType } from "@/features/management/types/group";
import { useQuery } from "@tanstack/react-query";

const dummyTree: TreeType[] = [
  {
    id: "A",
    name: "Category A",
    member: 21,
    branch: [
      {
        id: "A1",
        name: "Subcategory A1",
        member: 22,
        branch: [
          { id: "A1-1", name: "Item A1-1" },
          { id: "A1-2", name: "Item A1-2" },
          {
            id: "A1-3",
            name: "Item A1-3",
            branch: [
              {
                id: "A1",
                name: "Subcategory A1",
                branch: [
                  { id: "A1-1", name: "Item A1-1" },
                  { id: "A1-2", name: "Item A1-2" },
                  { id: "A1-3", name: "Item A1-3" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "A2",
        name: "Subcategory A2",
        member: 22,
        branch: [
          { id: "A2-1", name: "Item A2-1" },
          { id: "A2-2", name: "Item A2-2" },
          { id: "A2-3", name: "Item A2-3" },
        ],
      },
    ],
  },
  {
    id: "B",
    name: "Category B",
    branch: [
      {
        id: "B1",
        name: "Subcategory B1",
        branch: [
          { id: "B1-1", name: "Item B1-1" },
          { id: "B1-2", name: "Item B1-2" },
        ],
      },
    ],
  },
  {
    id: "C",
    name: "Category C",
    branch: [
      { id: "C1", name: "Item C1" },
      { id: "C2", name: "Item C2" },
    ],
  },
];

const GroupManagement = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentGroup, setCurrentGroup] = useState<TreeType>();

  const {
    data: groups = dummyTree,
    isFetching,
    isError,
  } = useQuery<TreeType[]>({
    queryKey: ["groups"],
    // TODO: API ができたらここを本実装に差し替え
    queryFn: async () => {
      const res = await fetch("/api/groups");
      if (!res.ok) throw new Error("Failed to fetch groups");
      return (await res.json()) as TreeType[];
    },
    // テスト用デフォルトデータ
    initialData: dummyTree,
  });

  useEffect(() => {
    if (breadcrumbs.length > 0) return;
    if (!groups || groups.length === 0) return;

    setBreadcrumbs([{ crumb: groups[0].name }]);
    setCurrentGroup(groups[0]);
  }, [groups, breadcrumbs.length]);

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionName}>グループ一覧</h2>

      <header className={styles.menuContainer}>
        <nav className={styles.breadcrumbsContainer}>
          <ul className={styles.breadcrumbs}>
            {breadcrumbs.map((item, index) => (
              <>
                <li key={`${item.crumb}-${index}`}>{item.crumb}</li>
                {index !== breadcrumbs.length - 1 && <span>/</span>}
              </>
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
          <Tree items={groups} level={0} />
        </aside>
        <div className={styles.groupInfo}>
          <div className={styles.currentGroup}>
            <h3 className={styles.groupName}>{currentGroup?.name}</h3>

            <hr />

            <ul className={styles.groupDetail}>
              <li>{`${currentGroup?.member} members`}</li>
              <li>{`${22} sub-groups`}</li>
            </ul>
          </div>
          <div className={styles.subGroupsContainer}>
            <h3>サブグループ</h3>
            <div className={styles.subGroups}>
              <GroupCard
                name="soukagakkai"
                member={22}
                subGroups={222}
                handleSelectGroup={() => 1}
              />
              <GroupCard
                name="toitukyoukai"
                member={22}
                subGroups={22222222222222}
                handleSelectGroup={() => 1}
              />
              <GroupCard
                name="yatumonji"
                member={22}
                subGroups={22222222222222}
                handleSelectGroup={() => 1}
              />
              <GroupCard
                name="kouhukunokagaku"
                member={22}
                subGroups={22222222222222}
                handleSelectGroup={() => 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
