import { useState, useEffect, useRef, useMemo, type ChangeEvent } from "react";
import styles from "./searchFilter.module.css";
import { GoChevronDown } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { type TreeType } from "@/features/management/types/group";
import { getAllIds } from "@/features/post/utils/tree";

type CheckBoxProps = {
  node: TreeType;
  selectedIds: Set<number>;
  expandedIds: Set<number>;
  onToggle: (node: TreeType, isChecked: boolean) => void;
  onExpand: (id: number) => void;
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

  const isChecked = selectedIds.has(node.groupId);
  const isExpanded = expandedIds.has(node.groupId);
  const hasChildren = node?.branchGroups ? true : false;

  const childrenIds = useMemo(
    () => getAllIds(node).filter((id) => id !== node.groupId),
    [node],
  );

  const allChildrenChecked =
    childrenIds.length > 0 && childrenIds.every((id) => selectedIds.has(id));

  const someChildChecked = childrenIds.some((id) => selectedIds.has(id));

  const visualChecked = isChecked || allChildrenChecked;
  const visualUncertain = !visualChecked && someChildChecked;

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
        onClick={() => onExpand(node.groupId)}
        className={`styles.clickContainer ${!hasChildren ? "is-hidden" : ""}`}
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
        {node.groupName}
      </label>

      {hasChildren && isExpanded && node.branchGroups && (
        <div>
          {node.branchGroups.map((n) => (
            <CheckBoxRow
              key={n.groupId}
              node={n}
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

type Props = {
  groups: TreeType[];
  selectedIds: Set<number>;
  setSelectedIds: (ids: Set<number>) => void;
};

export const SearchFilter = ({
  groups,
  selectedIds,
  setSelectedIds,
}: Props) => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const handleExpandToggle = (id: number) => {
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

  const handleToggle = (node: TreeType, isChecked: boolean) => {
    const childrenIds = getAllIds(node);

    const next = new Set(selectedIds);
    if (isChecked) {
      childrenIds.forEach((id) => next.add(id));
    } else {
      childrenIds.forEach((id) => next.delete(id));
    }
    setSelectedIds(next);

    if (isChecked && node.branchGroups && node.branchGroups.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(node.groupId);
        return next;
      });
    }
  };

  return (
    <div>
      <div>
        <strong>検索グループ</strong>
        <div>
          {Array.from(selectedIds)
            .sort((a, b) => Number(a) - Number(b))
            .join(",")}
        </div>
      </div>
      <CheckBoxRow
        key={0}
        node={{ groupId: 0, groupName: "全体公開" }}
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        onExpand={handleExpandToggle}
        onToggle={handleToggle}
      />
      {groups.map((node) => (
        <CheckBoxRow
          key={node.groupId}
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
