import { useState } from "react";
import { type TreeType } from "../../types/group";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import styles from "./tree.module.css";

type Props = {
  items: TreeType[];
  level: number;
  handleBranchClick: (id: number) => void;
};

export const Tree = ({ items, level, handleBranchClick }: Props) => {
  const [openItems, setOpenItems] = useState<{
    [key: TreeType["id"]]: boolean;
  }>({});

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
            className={styles.branch}
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
              handleBranchClick={handleBranchClick}
            />
          )}
        </div>
      ))}
    </>
  );
};
