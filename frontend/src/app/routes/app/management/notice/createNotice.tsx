import { useState, type FormEvent } from "react"; // useEffectは不要になったので削除
import { useNavigate } from "react-router";
import styles from "@/features/notice/styles/createNotice.module.css";
import { type TreeType } from "@/features/management/types/group";
import GroupSelector from "@/features/notice/components/groupSelector";

// データ定義
const items: TreeType[] = [
  {
    id: 1,
    name: "八文字学園",
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

// ------------------------------------------------------------------
// ヘルパー関数: 指定されたIDとその配下の全IDを取得して配列で返す
// ------------------------------------------------------------------
const getFlattenedIds = (targetId: number, nodes: TreeType[]): number[] => {
  let results: number[] = [];

  for (const node of nodes) {
    if (node.id === targetId) {
      // ヒット！自分自身を追加
      results.push(node.id);

      // 子要素があれば、それを全て再帰的に回収する関数
      const collectAllChildren = (subNodes: TreeType[]) => {
        subNodes.forEach((n) => {
          results.push(n.id);
          if (n.branch) collectAllChildren(n.branch);
        });
      };

      if (node.branch) {
        collectAllChildren(node.branch);
      }
      return results; // 見つかったのでループ終了
    }

    // ヒットしなかった場合、さらに深く探索
    if (node.branch) {
      const childResults = getFlattenedIds(targetId, node.branch);
      if (childResults.length > 0) {
        return childResults;
      }
    }
  }
  return results;
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
const CreateNotice = () => {
  const navigate = useNavigate();

  // 以前の useGroupSelector は削除し、単一ID管理に変更
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedGroupId) return;

    // ★重要: 単一選択されたIDから、包含される全IDリストに変換
    // これにより保存データ上は「配下全てが選択された」状態になる
    const targetGroupIds = getFlattenedIds(selectedGroupId, items);

    const newNotice = {
      id: Date.now(),
      title,
      content,
      targetGroups: targetGroupIds, // 配列として保存
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const savedNoticesStr = localStorage.getItem("demo_notices");
    const savedNotices = savedNoticesStr ? JSON.parse(savedNoticesStr) : [];

    localStorage.setItem(
      "demo_notices",
      JSON.stringify([newNotice, ...savedNotices]),
    );

    navigate("/manager/notice");
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル
            <span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            required
            placeholder="例：システムメンテナンスのお知らせ"
          />
          <div className={styles.charCount}>
            <span
              className={
                title.length >= MAX_TITLE_LENGTH ? styles.charCountWarning : ""
              }
            >
              {title.length}
            </span>
            <span> / {MAX_TITLE_LENGTH}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            内容
            <span className={styles.requiredBadge}>必須</span>
          </label>
          <textarea
            id="content"
            className={styles.textareaField}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            required
            rows={6}
            placeholder="お知らせの詳細内容を入力してください"
          />
          <div className={styles.charCount}>
            <span
              className={
                content.length >= MAX_CONTENT_LENGTH
                  ? styles.charCountWarning
                  : ""
              }
            >
              {content.length}
            </span>
            <span> / {MAX_CONTENT_LENGTH}</span>
          </div>
        </div>

        {/* --- 変更箇所 --- */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            配信先
            <span className={styles.requiredBadge}>必須</span>
          </label>
          {/* GroupSelector を TreeSelect に置き換え */}
          <div style={{ maxWidth: "100%" }}>
            <GroupSelector
              data={items}
              onSelect={setSelectedGroupId}
              // ↓ ここを initialSelectedId ではなく selectedId にして常に親の状態と同期させる
              selectedId={selectedGroupId ?? undefined}
            />
          </div>
          {/* 現在の選択状態を表示（デバッグ用・あるいはUX向上用） */}
          <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            {selectedGroupId
              ? "※選択された範囲とその配下すべてに配信されます"
              : "配信範囲を選択してください"}
          </div>
        </div>
        {/* ---------------- */}

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            // 配列の長さチェックではなく、IDがあるかどうかで判定
            disabled={!title || !content || !selectedGroupId}
          >
            作成する
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotice;
