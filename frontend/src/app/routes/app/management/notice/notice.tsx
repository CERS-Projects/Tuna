import { useState, useEffect } from "react";
import { Link } from "react-router";
import { NoticeCard } from "@/features/notice/components/noticeCard";
import { type Notice } from "@/features/notice/types/notice";
import { FiPlus, FiBell } from "react-icons/fi";
import styles from "@/features/notice/styles/notice.module.css";

export const dummyNotices: Notice[] = [
  {
    id: 1,
    title: "【全体】システムメンテナンスのお知らせ",
    content: "2026年3月1日の0時から2時までメンテナンスを行います。",
    updatedAt: "2026-02-10",
    // 「八文字学園(1)」を選択（配下すべてが含まれる想定）
    targetGroups: [1, 2, 3, 4, 10, 11, 5, 6, 12, 13, 7, 14, 15],
  },
  {
    id: 2,
    title: "【特定学科】IT系学生向けの求人情報",
    content:
      "新しい求人票が届きました。キャリア支援センターで確認してください。",
    updatedAt: "2026-02-11",
    // 「水戸電子(2)」配下の学科のみを選択（親の2は入っていない状態のテスト）
    targetGroups: [3, 4, 10],
  },
  {
    id: 3,
    title: "【医療系のみ】健康診断再検査の案内",
    content: "対象者には別途メールを送信していますが、こちらでも周知します。",
    updatedAt: "2026-02-12",
    // 「水戸中央病院(101)」を選択
    targetGroups: [101, 102, 103, 104],
  },
  {
    id: 4,
    title: "【複数箇所】事務局からのお知らせ",
    content: "年末年始の窓口業務について。",
    updatedAt: "2026-02-13",
    // 「総務部(201)」と「経理部(202)」など、離れた場所を複数選択
    targetGroups: [201, 202],
  },
];

const NoticePage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const savedNoticesStr = localStorage.getItem("demo_notices");
    const savedNotices = savedNoticesStr ? JSON.parse(savedNoticesStr) : [];

    const allNotices = [...savedNotices, ...dummyNotices];

    setNotices(allNotices);
  }, []);

  const handleDeleteNotice = (id: number) => {
    setNotices((prevNotices) => {
      const newNotices = prevNotices.filter((notice) => notice.id !== id);
      return newNotices;
    });
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <h2 className={styles.pageTitle}>
            <FiBell className={styles.titleIcon} />
            <span>お知らせ</span>
          </h2>

          <Link to="/manager/notice/create" className={styles.createButton}>
            <FiPlus className={styles.btnIcon} />
            <span className={styles.btnText}>新規作成</span>
          </Link>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.feedContainer}>
          {notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDelete={handleDeleteNotice}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>お知らせはありません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NoticePage;
