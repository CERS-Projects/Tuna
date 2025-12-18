import { useState } from "react";
import { type Breadcrumb } from "@/features/management/types/breadcrumb";
import { Tree } from "@/features/management/components/tree/tree";
import { FaPen, FaPlus } from "react-icons/fa";
import styles from "@/features/management/style/groupManagement.module.css";
import { type TreeType } from "@/features/management/types/group";

const dummy: Breadcrumb[] = [
  { crumb: "mito" },
  { crumb: "hamada" },
  { crumb: "hamada-tyounaikai" },
];

const dummyTree: TreeType[] = [
  {
    id: "A",
    name: "Category A",
    branch: [
      {
        id: "A1",
        name: "Subcategory A1",
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
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(dummy);

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
          <Tree items={dummyTree} level={0} />
        </aside>
        <div className={styles.groupInfo}>
          <div className={styles.currentGroup}>current group</div>
          <div className={styles.subGroupsContainer}>
            <h3>サブグループ</h3>
            <div className={styles.subGroups}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
