import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { useNavigate } from "react-router";
import { PiHouseLight } from "react-icons/pi";
import styles from "./menu.module.css";
import { paths } from "@/config/paths";

export const Menu = () => {
  const navigate = useNavigate();

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
        onClick={() => navigate(paths.app.profile.posts.getHref())}
        className={styles.menuButton}
        title="プロフィール"
      >
        <AiOutlineSolution />
      </button>
      <button
        onClick={() => navigate(paths.app.profile.bookmarks.getHref())}
        className={styles.menuButton}
        title="ブックマーク"
      >
        <BsBookmark />
      </button>
    </div>
  );
};
