import React from "react";
import { type TreeType } from "@/features/management/types/group";
import styles from "./groupSelector.module.css";

// ★ここでの const items = ... の定義は削除します（親から貰うため）

// Propsの型定義を追加
type GroupSelectorProps = {
  data: TreeType[]; // 親からデータを受け取る
  selectedId?: number; // 現在の選択IDを受け取る
  onSelect: (id: number) => void; // 変更を親に伝える
};

type TreeNodeProps = {
  node: TreeType;
  selectedId: number | null;
  onSelect: (id: number) => void;
  isAncestorSelected?: boolean;
};

// 再帰パーツ（ここはほぼ変更なしですが、型の整合性をとります）
export function TreeNode({
  node,
  selectedId,
  onSelect,
  isAncestorSelected = false,
}: TreeNodeProps) {
  const isSelfSelected = selectedId === node.id;
  const isActive = isSelfSelected || isAncestorSelected;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // クリックイベントのバブリング防止
    if (!isAncestorSelected) {
      onSelect(node.id);
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
          {node.name}
          {isAncestorSelected && (
            <span className={styles.subText}>(親に含まれます)</span>
          )}
        </span>
      </div>

      {node.branch && node.branch.length > 0 && (
        <div className={styles.childrenWrapper}>
          {node.branch.map((childNode) => (
            <TreeNode
              key={childNode.id}
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

// メインコンポーネント
// Propsを受け取るように変更し、内部のuseStateは削除（親の状態を使うため）
export default function GroupSelector({
  data,
  selectedId,
  onSelect,
}: GroupSelectorProps) {
  return (
    <div className={styles.treeContainer}>
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          // 親から来た selectedId をそのまま使う（なければ null）
          selectedId={selectedId ?? null}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
