import { LuCirclePlus } from "react-icons/lu";
import {
  FaHome,
  FaSearch,
  FaChalkboardTeacher,
  FaIdCard,
  FaBookmark,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import styles from "./menu.module.css";
import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Menu = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);

  return (
    <div className={styles.menuContainer}>
      <button
        onClick={() => navigate(paths.app.timeline.path)}
        title="タイムライン"
      >
        <FaHome />
      </button>
      <button
        onClick={() => navigate(paths.app.searchPost.path)}
        className={styles.menuButton}
        title="検索"
      >
        <FaSearch />
      </button>
      <button
        onClick={() => navigate(paths.app.classroom.path)}
        className={styles.menuButton}
        title="授業ルーム"
      >
        <FaChalkboardTeacher />
      </button>
      <button
        onClick={() => navigate(paths.app.timeline.post.path)}
        className={styles.menuButton}
        title="投稿"
      >
        <LuCirclePlus />
      </button>
      <button
        onClick={() =>
          navigate(paths.app.profile.posts.getHref(user?.showUserId as string))
        }
        className={styles.menuButton}
        title="プロフィール"
      >
        <FaIdCard />
      </button>
      <button
        onClick={() =>
          navigate(
            paths.app.profile.bookmarks.getHref(user?.showUserId as string),
          )
        }
        className={styles.menuButton}
        title="ブックマーク"
      >
        <FaBookmark />
      </button>
      <button
        onClick={() => navigate(paths.app.profile.setting.path)}
        className={styles.menuButton}
        title="設定"
      >
        <FaCog />
      </button>
    </div>
  );
};
