import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { useNavigate } from "react-router";
import { PiHouseLight } from "react-icons/pi";
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
        <PiHouseLight />
      </button>
      <button
        onClick={() => navigate(paths.app.searchPost.path)}
        className={styles.menuButton}
        title="検索"
      >
        <HiOutlineMagnifyingGlass />
      </button>
      <button
        onClick={() => navigate(paths.app.classroom.path)}
        className={styles.menuButton}
        title="授業ルーム"
      >
        <IoSchoolOutline />
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
        <AiOutlineSolution />
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
        <BsBookmark />
      </button>
    </div>
  );
};
