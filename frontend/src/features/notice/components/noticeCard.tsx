import { type Notice } from "@/features/notice/types/notice";
import { Link } from "react-router";
import { type MouseEvent, useMemo } from "react";
import { FiTrash2, FiClock, FiUsers } from "react-icons/fi";
import styles from "./noticeCard.module.css";
import { paths } from "@/config/paths";
import { type TreeType } from "@/features/management/types/group";

const items: TreeType[] = [
  {
    groupId: 1,
    groupName: "八文字学園",
    branch: [
      {
        id: 2,
        name: "水戸電子専門学校",
        branch: [
          { id: 3, name: "情報処理学科" },
          { id: 4, name: "情報システム学科" },
          { id: 10, name: "高度ITデザイン学科" },
          { id: 11, name: "ゲームクリエイト学科" },
        ],
      },
      {
        id: 5,
        name: "水戸看護福祉専門学校",
        branch: [
          { id: 6, name: "看護学科" },
          { id: 12, name: "介護福祉学科" },
          { id: 13, name: "精神保健福祉学科" },
        ],
      },
      {
        id: 7,
        name: "水戸ビューティカレッジ",
        branch: [
          { id: 14, name: "美容師科" },
          { id: 15, name: "トータルビューティ科" },
        ],
      },
    ],
  },
  {
    id: 100,
    name: "提携医療機関",
    branch: [
      {
        id: 101,
        name: "水戸中央病院",
        branch: [
          { id: 102, name: "内科" },
          { id: 103, name: "外科" },
          { id: 104, name: "小児科" },
        ],
      },
      {
        id: 105,
        name: "ひたちなかクリニック",
      },
    ],
  },
  {
    id: 200,
    name: "事務局・管理部門",
    branch: [
      { id: 201, name: "総務部" },
      { id: 202, name: "経理部" },
      { id: 203, name: "キャリア支援センター" },
    ],
  },
];
// ---------------------------------------------
// ヘルパー関数: IDリストから「表示すべき名前」を抽出する
// ---------------------------------------------
const getScopeLabel = (
  allTreeItems: TreeType[],
  targetIds: number[],
): string => {
  if (!targetIds || targetIds.length === 0) return "なし";

  const names: string[] = [];

  // 再帰的にツリーを探索
  const traverse = (nodes: TreeType[]) => {
    for (const node of nodes) {
      // 親が含まれているなら、その名前を使って「配下は省略」する
      // (先ほどのロジックで、全選択なら親IDが入っているはずなので)
      if (targetIds.includes(node.id)) {
        names.push(node.name);
        // 親が見つかったら、その子供たちは探索しなくて良い（親に包含されるため）
        continue;
      }

      // 親が含まれていないなら、子供の中に選択されたものがいるか探しに行く
      if (node.branch) {
        traverse(node.branch);
      }
    }
  };

  traverse(allTreeItems);

  return names.length > 0 ? names.join(", ") : "未設定";
};

export const NoticeCard = ({
  notice,
  onDelete,
}: {
  notice: Notice;
  onDelete: (id: number) => void;
}) => {
  // 配信範囲の表示名を取得
  // notice.targetGroups が保存されている前提 (例: [2, 3, 4])
  const scopeLabel = useMemo(() => {
    // targetGroupsがない場合のガード
    const targets = notice.targetGroups || [];
    return getScopeLabel(items, targets);
  }, [notice.targetGroups]);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const result = window.confirm("このお知らせを削除しますか？");
    if (result) {
      onDelete(notice.id);
    }
  };

  return (
    <Link
      to={paths.app.management.notice.edit.getHref(notice.id)}
      state={{ notice }}
      className={styles.noticeCard}
    >
      <div className={styles.noticeHeader}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.scopeWrapper}>
            <FiUsers className={styles.scopeIcon} size={14} />
            <span className={styles.scopeText} title={scopeLabel}>
              {scopeLabel}
            </span>
          </div>

          <h3 className={styles.noticeTitle}>{notice.title}</h3>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          aria-label="削除"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      <p className={styles.noticeContent}>{notice.content}</p>

      <div className={styles.noticeFooter}>
        <FiClock className={styles.clockIcon} />
        <span className={styles.noticeDate}>{notice.updatedAt}</span>
      </div>
    </Link>
  );
};
