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
  if (node.id === targetId) return true;
  if (!node.branch || node.branch.length === 0) return false;
  return node.branch.some((child) => subtreeHasId(child, targetId));
};

export const Tree = ({ items, level, currentId, handleBranchClick }: Props) => {
  const [openItems, setOpenItems] = useState<{
    [key: TreeType["id"]]: boolean;
  }>({});

  useEffect(() => {
    if (currentId == null) return;

    const idsToOpen = items
      .filter((item) => item.branch && subtreeHasId(item, currentId))
      .map((item) => item.id);

    if (idsToOpen.length === 0) return;

    setOpenItems((prev) => {
      const next = { ...prev };
      for (const id of idsToOpen) next[id] = true;
      return next;
    });
  }, [items, currentId]);

  const toggleItem = (id: TreeType["id"]) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      {items.map((item) => (
        <div key={item.id} className={styles.tree}>
          <div
            className={
              item.id === currentId
                ? `${styles.branch} ${styles.branch_active}`
                : styles.branch
            }
            onClick={() => item.branch && toggleItem(item.id)}
          >
            {item.branch ? (
              openItems[item.id] ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )
            ) : (
              ""
            )}
            <button
              onKeyDown={() => handleBranchClick(item.id)}
              onClick={() => handleBranchClick(item.id)}
            >
              {item.name}
            </button>
          </div>
          {item.branch && openItems[item.id] && (
            <Tree
              items={item.branch}
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
