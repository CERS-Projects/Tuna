import React from "react";
import { type TreeType } from "@/features/management/types/group";
import styles from "./groupSelector.module.css";

type GroupSelectorProps = {
  data: TreeType[];
  selectedId?: number;
  onSelect: (id: number) => void;
};

type TreeNodeProps = {
  node: TreeType;
  selectedId: number | null;
  onSelect: (id: number) => void;
  isAncestorSelected?: boolean;
};

export function TreeNode({
  node,
  selectedId,
  onSelect,
  isAncestorSelected = false,
}: TreeNodeProps) {
  const isSelfSelected = selectedId === node.groupId;
  const isActive = isSelfSelected || isAncestorSelected;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAncestorSelected) {
      onSelect(node.groupId);
    }
  };

  return (
    <div>
      <div
        className={`${styles.nodeItem} ${isAncestorSelected ? styles.nodeItemDisabled : ""}`}
        onClick={handleClick}
      >
        <input
          type="radio"
          checked={isActive}
          readOnly
          className={styles.radioInput}
        />
        <span
          className={`${styles.nodeLabel} ${isSelfSelected ? styles.labelSelected : ""}`}
        >
          {node.groupName}
          {isAncestorSelected && (
            <span className={styles.subText}>(親に含まれます)</span>
          )}
        </span>
      </div>

      {node.branchGroups && node.branchGroups.length > 0 && (
        <div className={styles.childrenWrapper}>
          {node.branchGroups.map((childNode) => (
            <TreeNode
              key={childNode.groupId}
              node={childNode}
              selectedId={selectedId}
              onSelect={onSelect}
              isAncestorSelected={isActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GroupSelector({
  data,
  selectedId,
  onSelect,
}: GroupSelectorProps) {
  return (
    <div className={styles.treeContainer}>
      {data.map((node) => (
        <TreeNode
          key={node.groupId}
          node={node}
          selectedId={selectedId ?? null}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
