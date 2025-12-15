import styles from "./menuDrawer.module.css";
import {
  MdGroups,
  MdMeetingRoom,
  MdManageAccounts,
  MdWarning,
} from "react-icons/md";
import { FaComments, FaBell, FaSchool } from "react-icons/fa6";
import { Link } from "react-router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const MenuDrawer = ({ isOpen, onClose }: Props) => {
  const dummyRole = "ADMIN";

  if (isOpen) {
    return (
      <aside className={styles.drawer}>
        <nav className={styles.navList}>
          <Link to="" className={styles.navCard}>
            <MdGroups className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>グループ管理</h3>
              <p>グループの作成・編集 / メンバーの管理を行う</p>
            </div>
          </Link>
          <Link to="" className={styles.navCard}>
            <FaComments className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>投稿管理</h3>
              <p>投稿の管理を行う</p>
            </div>
          </Link>
          <Link to="" className={styles.navCard}>
            <MdMeetingRoom className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>授業ルーム管理</h3>
              <p>授業ルームの管理を行う</p>
            </div>
          </Link>
          <Link to="" className={styles.navCard}>
            <FaBell className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>お知らせ管理</h3>
              <p>お知らせの管理を行う</p>
            </div>
          </Link>
          <Link to="" className={styles.navCard}>
            <MdManageAccounts className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>アカウント管理</h3>
              <p>アカウントの管理を行う</p>
            </div>
          </Link>
          <Link to="" className={styles.navCard}>
            <MdWarning className={styles.navIcon} />
            <div className={styles.navDescription}>
              <h3>通報管理</h3>
              <p>通報の管理を行う</p>
            </div>
          </Link>
          {dummyRole === "ADMIN" && (
            <Link to="" className={styles.navCard}>
              <FaSchool className={styles.navIcon} />
              <div className={styles.navDescription}>
                <h3>学校情報管理</h3>
                <p>学校情報の管理を行う</p>
              </div>
            </Link>
          )}
        </nav>
      </aside>
    );
  }
};
