import { useState, useEffect, useRef, useMemo, type ChangeEvent } from "react";
import styles from "./searchFilter.module.css";
import { GoChevronDown } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";

//受け取るデータの型
export type NodeItem = {
  id: number;
  name: string;
  classid: number;
};

//ツリー構造
type TreeNode = {
  id: string;
  label: string;
  children: TreeNode[];
};

//ツリー構造への変換
const BuildTree = (items: NodeItem[]): TreeNode[] => {
  const idMapping: { [key: string]: TreeNode } = {};
  const roots: TreeNode[] = [];

  //マッピングの作成
  items.forEach((item) => {
    const strId = String(item.id);
    idMapping[strId] = {
      id: strId,
      label: item.name,
      children: [],
    };
  });

  //階層構造
  items.forEach((item) => {
    const strId = String(item.id);
    const node = idMapping[strId];

    if (item.classid === 0) {
      roots.push(node);
    } else {
      const parentId = String(item.classid);
      const parent = idMapping[parentId];
      if (parent) {
        parent.children.push(node);
      } else {
        //親が見つからなかったときはルートになる
        roots.push(node);
      }
    }
  });

  return roots;
};

//指定したノード以下の全IDを取得する再帰
const GetAllTreeId = (node: TreeNode): string[] => {
  let ids = [node.id];
  node.children.forEach((child) => {
    ids = ids.concat(GetAllTreeId(child));
  });
  return ids;
};

//チェックボックスの行
type CheckBoxProps = {
  node: TreeNode;
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  onToggle: (node: TreeNode, isChecked: boolean) => void;
  onExpand: (id: string) => void;
  level?: number;
};

const CheckBoxRow = ({
  node,
  selectedIds,
  expandedIds,
  onToggle,
  onExpand,
  level = 0,
}: CheckBoxProps) => {
  const checkBoxRef = useRef<HTMLInputElement>(null);

  //自身の状態
  const isChecked = selectedIds.has(node.id);
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children.length > 0;

  //子の状態
  const childrenIds = useMemo(
    () => GetAllTreeId(node).filter((id) => id !== node.id),
    [node]
  );

  const allChildrenChecked =
    childrenIds.length > 0 && childrenIds.every((id) => selectedIds.has(id));

  const someChildChecked = childrenIds.some((id) => selectedIds.has(id));

  //表示用フラグ
  const visualChecked = isChecked || allChildrenChecked;
  const visualUncertain = !visualChecked && someChildChecked;

  //Uncertain（不確定）状態のDOM操作
  useEffect(() => {
    if (checkBoxRef.current) {
      checkBoxRef.current.indeterminate = visualUncertain;
    }
  }, [visualUncertain]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onToggle(node, e.target.checked);
  };

  return (
    <div
      style={{ marginLeft: `${level * 4}%` }}
      className={styles.searchFilterContainer}
    >
      <span
        onClick={() => onExpand(node.id)}
        style={{
          display: "inline-block",
          alignItems: "center",
          justifyContent: "center",
          height: "20px",
          width: "20px",
          cursor: "pointer",
          textAlign: "center",
          userSelect: "none",
          padding: "5px",
          visibility: hasChildren ? "visible" : "hidden",
        }}
      >
        {isExpanded ? <GoChevronDown /> : <GoChevronRight />}
      </span>
      <label>
        <input
          ref={checkBoxRef}
          type="checkbox"
          checked={visualChecked}
          onChange={handleChange}
          className={styles.checkIcon}
        />
        {node.label}
      </label>

      {/*再起呼び出し*/}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <CheckBoxRow
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onExpand={onExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

//メイン処理
type TreeCheckBoxProps = {
  flatData: NodeItem[];
};

export const SearchFilter = ({ flatData }: TreeCheckBoxProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  //フラットなデータをツリーに変換（メモ化）
  const treeData = useMemo(() => BuildTree(flatData), [flatData]);

  const handleExpandToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggle = (node: TreeNode, isChecked: boolean) => {
    const childrenIds = GetAllTreeId(node);

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isChecked) {
        childrenIds.forEach((id) => next.add(id));
      } else {
        childrenIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  return (
    <div>
      <div>
        <strong>aaa</strong>
        <div>
          {Array.from(selectedIds)
            .sort((a, b) => Number(a) - Number(b))
            .join(",") || "Global"}
        </div>
      </div>
      {treeData.map((node) => (
        <CheckBoxRow
          key={node.id}
          node={node}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onExpand={handleExpandToggle}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};
