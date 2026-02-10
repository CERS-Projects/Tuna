import { useState, useEffect } from "react";
import { type TreeType } from "../../types/group";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import styles from "./tree.module.css";

type Props = {
  items: TreeType[];
  level: number;
  currentId: number | undefined;
  handleBranchClick: (id: number) => void;
};

const subtreeHasId = (node: TreeType, targetId: number): boolean => {
  if (node.groupId === targetId) return true;
  if (!node.branchGroups || node.branchGroups.length === 0) return false;
  return node.branchGroups.some((child) => subtreeHasId(child, targetId));
};

export const Tree = ({ items, level, currentId, handleBranchClick }: Props) => {
  const [openItems, setOpenItems] = useState<{
    [key: TreeType["groupId"]]: boolean;
  }>({});

  useEffect(() => {
    if (currentId == null) return;

    const idsToOpen = items
      .filter((item) => item.branchGroups && subtreeHasId(item, currentId))
      .map((item) => item.groupId);

    if (idsToOpen.length === 0) return;

    setOpenItems((prev) => {
      const next = { ...prev };
      for (const id of idsToOpen) next[id] = true;
      return next;
    });
  }, [items, currentId]);

  const toggleItem = (id: TreeType["groupId"]) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      {items.map((item) => (
        <div key={item.groupId} className={styles.tree}>
          <div
            className={
              item.groupId === currentId
                ? `${styles.branch} ${styles.branch_active}`
                : styles.branch
            }
            onClick={() => item.branchGroups && toggleItem(item.groupId)}
          >
            {item.branchGroups ? (
              openItems[item.groupId] ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )
            ) : (
              ""
            )}
            <button
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBranchClick(item.groupId);
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                handleBranchClick(item.groupId);
              }}
            >
              {item.groupName}
            </button>
          </div>
          {item.branchGroups && openItems[item.groupId] && (
            <Tree
              items={item.branchGroups}
              level={level + 1}
              currentId={currentId}
              handleBranchClick={handleBranchClick}
            />
          )}
        </div>
      ))}
    </>
  );
};
