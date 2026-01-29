import { type MenuItemType } from "@/features/profile/types/profileTypes";
import { MenuItem } from "@/features/profile/components/menuItem/menuItem";
import { FaSignOutAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoFilterOutline } from "react-icons/io5";
import styles from "@/features/profile/styles/settingMenu.module.css";

const MenuItems: MenuItemType[] = [
  {
    menuName: "パスワード更新",
    menuPath: "/app/profile/edit/editPassword",
    menuIcon: <RiLockPasswordFill />,
    menuLabel: "パスワードの変更を行います",
  },
  {
    menuName: "フィルタリング設定",
    menuPath: "/app/profile/edit/editFilter",
    menuIcon: <IoFilterOutline />,
    menuLabel: "フィルタリングの設定を行います",
  },
  {
    menuName: "ログアウト",
    menuPath: "/",
    menuIcon: <FaSignOutAlt />,
    menuLabel: "ログアウトします",
  },
];

const SettingMenu = () => {
  return (
    <div>
      <div className={styles.settingMenuHeader}>
        <h2>設定メニュー </h2>
      </div>
      <div className={styles.settingMenuMain}>
        {MenuItems.map((item) => (
          <MenuItem key={item.menuName} {...item} />
        ))}
      </div>
    </div>
  );
};

export default SettingMenu;
