import { memo, useCallback, useState } from "react";
import { type TreeType } from "@/features/management/types/group";
import styles from "./range.module.css";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { flattenTree, getAllIds } from "../../utils/tree";

type RangeItemProps = {
  node: TreeType;
  selectedGroupIds: number[];
  onToggle: (node: TreeType) => void;
  depth?: number;
};

const RangeItem = memo(
  ({ node, selectedGroupIds, onToggle, depth = 0 }: RangeItemProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isChecked = selectedGroupIds.includes(node.id);
    const hasChildren = node.branch && node.branch.length > 0;

    const handleToggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };

    const handleToggleSelect = () => onToggle(node);

    return (
      <div className={styles.rangeItemWrapper}>
        <div
          className={`${styles.rangeItem} ${isChecked ? styles.rangeItemSelected : ""}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren && (
            <button
              type="button"
              className={styles.expandButton}
              onClick={handleToggleExpand}
            >
              {isExpanded ? (
                <IoChevronDown size={14} />
              ) : (
                <IoChevronForward size={14} />
              )}
            </button>
          )}
          {!hasChildren && <span className={styles.expandSpacer} />}
          <Checkbox
            checked={isChecked}
            onChange={handleToggleSelect}
            labelTextAfterLink={
              <>
                {node.name}
                {hasChildren && (
                  <span className={styles.childCount}>
                    ({node.branch!.length})
                  </span>
                )}
              </>
            }
          />
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.childrenContainer}>
            {node.branch!.map((child) => (
              <RangeItem
                key={child.id}
                node={child}
                selectedGroupIds={selectedGroupIds}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

RangeItem.displayName = "RangeItem";

type RangeSectionProps = {
  isInputStep: boolean;
  items: TreeType[];
  selectedGroupIds: number[];
  onToggleGroup: (ids: number[], isSelect: boolean) => void;
};

export const RangeSection = ({
  isInputStep,
  items,
  selectedGroupIds,
  onToggleGroup,
}: RangeSectionProps) => {
  const handleToggle = useCallback(
    (node: TreeType) => {
      const allIds = getAllIds(node);
      const isCurrentlySelected = selectedGroupIds.includes(node.id);
      onToggleGroup(allIds, !isCurrentlySelected);
    },
    [selectedGroupIds, onToggleGroup],
  );

  const flatItems = flattenTree(items);

  return (
    <div className={styles.rangeSection}>
      <div className={styles.rangeLabel}>
        {isInputStep ? "公開範囲を選択" : "公開範囲"}
      </div>
      <div className={styles.rangeList}>
        {isInputStep ? (
          items.map((item) => (
            <RangeItem
              key={item.id}
              node={item}
              selectedGroupIds={selectedGroupIds}
              onToggle={handleToggle}
            />
          ))
        ) : selectedGroupIds.length > 0 ? (
          flatItems
            .filter((item) => selectedGroupIds.includes(item.id))
            .map((item) => (
              <span key={item.id} className={styles.confirmTag}>
                {item.name}
              </span>
            ))
        ) : (
          <span className={styles.noSelectionMessage}>
            指定なし（全体公開）
          </span>
        )}
      </div>
    </div>
  );
};
