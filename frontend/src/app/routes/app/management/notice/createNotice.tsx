import { useState, type FormEvent } from "react"; // useEffectは不要になったので削除
import { useNavigate } from "react-router";
import styles from "@/features/notice/styles/createNotice.module.css";
import GroupSelector from "@/features/notice/components/groupSelector";

type TreeType = {
  groupId: number;
  groupName: string;
  branch?: TreeType[];
};

const items: TreeType[] = [
  {
    groupId: 1,
    groupName: "八文字学園",
    branch: [
      {
        groupId: 2,
        groupName: "水戸電子専門学校",
        branch: [
          { groupId: 3, groupName: "情報処理学科" },
          { groupId: 4, groupName: "情報システム学科" },
          { groupId: 10, groupName: "高度ITデザイン学科" },
          { groupId: 11, groupName: "ゲームクリエイト学科" },
        ],
      },
      {
        groupId: 5,
        groupName: "水戸看護福祉専門学校",
        branch: [
          { groupId: 6, groupName: "看護学科" },
          { groupId: 12, groupName: "介護福祉学科" },
          { groupId: 13, groupName: "精神保健福祉学科" },
        ],
      },
      {
        groupId: 7,
        groupName: "水戸ビューティカレッジ",
        branch: [
          { groupId: 14, groupName: "美容師科" },
          { groupId: 15, groupName: "トータルビューティ科" },
        ],
      },
    ],
  },
  {
    groupId: 100,
    groupName: "提携医療機関",
    branch: [
      {
        groupId: 101,
        groupName: "水戸中央病院",
        branch: [
          { groupId: 102, groupName: "内科" },
          { groupId: 103, groupName: "外科" },
          { groupId: 104, groupName: "小児科" },
        ],
      },
      {
        groupId: 105,
        groupName: "ひたちなかクリニック",
      },
    ],
  },
  {
    groupId: 200,
    groupName: "事務局・管理部門",
    branch: [
      { groupId: 201, groupName: "総務部" },
      { groupId: 202, groupName: "経理部" },
      { groupId: 203, groupName: "キャリア支援センター" },
    ],
  },
];

const getFlattenedIds = (targetId: number, nodes: TreeType[]): number[] => {
  let results: number[] = [];

  for (const node of nodes) {
    if (node.groupId === targetId) {
      results.push(node.groupId);

      const collectAllChildren = (subNodes: TreeType[]) => {
        subNodes.forEach((n) => {
          results.push(n.groupId);
          if (n.branch) collectAllChildren(n.branch);
        });
      };

      if (node.branch) {
        collectAllChildren(node.branch);
      }
      return results;
    }

    if (node.branch) {
      const childResults = getFlattenedIds(targetId, node.branch);
      if (childResults.length > 0) {
        return childResults;
      }
    }
  }
  return results;
};

const CreateNotice = () => {
  const navigate = useNavigate();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedGroupId) return;

    const targetGroupIds = getFlattenedIds(selectedGroupId, items);

    const newNotice = {
      id: Date.now(),
      title,
      content,
      targetGroups: targetGroupIds,
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

        <div className={styles.formGroup}>
          <label className={styles.label}>
            配信先
            <span className={styles.requiredBadge}>必須</span>
          </label>
          <div style={{ maxWidth: "100%" }}>
            <GroupSelector
              data={items}
              onSelect={setSelectedGroupId}
              selectedId={selectedGroupId ?? undefined}
            />
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            {selectedGroupId
              ? "※選択された範囲とその配下すべてに配信されます"
              : "配信範囲を選択してください"}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
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
