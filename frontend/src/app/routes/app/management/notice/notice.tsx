import { Link } from "react-router";
import { NoticeCard } from "@/features/management/components/noticeCard/noticeCard";
import { FiPlus, FiBell } from "react-icons/fi";
import styles from "@/features/management/style/notice.module.css";
import { useNotices } from "@/features/management/hooks/useNotices";
import { paths } from "@/config/paths";

const NoticePage = () => {
  const { notices, isLoading, isError, deleteNotice } = useNotices();

  const handleDeleteNotice = (id: string) => {
    if (confirm("本当に削除しますか？")) {
      deleteNotice(id);
    }
  };

  if (isLoading) {
    return <div className={styles.pageContainer}>読み込み中...</div>;
  }

  if (isError) {
    return <div className={styles.pageContainer}>エラーが発生しました。</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <h2 className={styles.pageTitle}>
            <FiBell className={styles.titleIcon} />
            <span>お知らせ</span>
          </h2>

          <Link
            to={paths.app.management.notice.create.path}
            className={styles.createButton}
          >
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
                key={notice.noticeId}
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
