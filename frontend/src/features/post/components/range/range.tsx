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
    const isChecked = selectedGroupIds.includes(node.groupId);
    const hasChildren = node.branchGroups && node.branchGroups.length > 0;

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
                {node.groupName}
                {hasChildren && (
                  <span className={styles.childCount}>
                    ({node.branchGroups!.length})
                  </span>
                )}
              </>
            }
          />
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.childrenContainer}>
            {node.branchGroups!.map((child) => (
              <RangeItem
                key={child.groupId}
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
      const isCurrentlySelected = selectedGroupIds.includes(node.groupId);
      onToggleGroup(allIds, !isCurrentlySelected);
    },
    [selectedGroupIds, onToggleGroup],
  );

  const isGlobalSelected = selectedGroupIds.includes(0);

  const handleToggleGlobal = useCallback(() => {
    onToggleGroup([0], !isGlobalSelected);
  }, [isGlobalSelected, onToggleGroup]);

  const flatItems = flattenTree(items);

  return (
    <div className={styles.rangeSection}>
      <div className={styles.rangeLabel}>
        {isInputStep ? "公開範囲を選択 (選択無しで全体公開)" : "公開範囲"}
      </div>
      <div className={styles.rangeList}>
        {isInputStep ? (
          <>
            <div className={styles.rangeItemWrapper}>
              <div
                className={`${styles.rangeItem} ${isGlobalSelected ? styles.rangeItemSelected : ""}`}
              >
                <span className={styles.expandSpacer} />
                <Checkbox
                  checked={isGlobalSelected}
                  onChange={handleToggleGlobal}
                  labelTextAfterLink={<>全体公開</>}
                />
              </div>
            </div>
            {items.map((item) => (
              <RangeItem
                key={item.groupId}
                node={item}
                selectedGroupIds={selectedGroupIds}
                onToggle={handleToggle}
              />
            ))}
          </>
        ) : selectedGroupIds.length > 0 ? (
          <>
            {isGlobalSelected && (
              <span className={styles.confirmTag}>全体公開</span>
            )}
            {flatItems
              .filter(
                (item) =>
                  item.groupId !== 0 && selectedGroupIds.includes(item.groupId),
              )
              .map((item) => (
                <span key={item.groupId} className={styles.confirmTag}>
                  {item.groupName}
                </span>
              ))}
          </>
        ) : (
          <span className={styles.noSelectionMessage}>
            指定なし（全体公開）
          </span>
        )}
      </div>
    </div>
  );
};
