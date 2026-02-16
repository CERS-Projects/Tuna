import { type MenuItemType } from "@/features/profile/types/profileTypes";
import { MenuItem } from "@/features/profile/components/menuItem/menuItem";
import { FaSignOutAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoFilterOutline } from "react-icons/io5";
import styles from "@/features/profile/styles/settingMenu.module.css";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/hooks/useAuth";

const MenuItems: MenuItemType[] = [
  {
    menuName: "パスワード更新",
    menuPath: paths.app.profile.setting.editPassword.getHref(),
    menuIcon: <RiLockPasswordFill />,
    menuLabel: "パスワードの変更を行います",
  },
  {
    menuName: "フィルタリング設定",
    menuPath: paths.app.profile.setting.editFilter.getHref(),
    menuIcon: <IoFilterOutline />,
    menuLabel: "フィルタリングの設定を行います",
  },
  {
    menuName: "ログアウト",
    menuIcon: <FaSignOutAlt />,
    menuLabel: "ログアウトします",
  },
];

const SettingMenu = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) logout();
  };

  const items = MenuItems.map((item) =>
    item.menuName === "ログアウト"
      ? { ...item, handleLogout: handleLogout }
      : item,
  );
  return (
    <div>
      <div className={styles.settingMenuHeader}>
        <h2>設定メニュー </h2>
      </div>
      <div className={styles.settingMenuMain}>
        {items.map((item) => (
          <MenuItem key={item.menuName} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SettingMenu;
