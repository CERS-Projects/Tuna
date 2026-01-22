import { type menuItemType } from "@/features/profile/types/profileTypes";
import { MenuItem } from "@/features/profile/components/menuItem/menuItem";
import { FaSignOutAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoFilterOutline } from "react-icons/io5";
import styles from "@/features/profile/styles/settingMenu.module.css";

const MenuItems: menuItemType[] = [
  {
    menuName: "パスワード更新",
    menuPath: "/password", 
    menuIcon: <RiLockPasswordFill />,
    menuLabel: "パスワードの変更を行います",
  },
  {
    menuName: "フィルタリング設定",
    menuPath: "/filter",
    menuIcon: <IoFilterOutline />,
    menuLabel: "フィルタリングの設定を行います",
  },
  {
    menuName: "ログアウト",
    menuPath: "/logout",
    menuIcon: <FaSignOutAlt />,
    menuLabel: "ログアウトします",
  },
];

const MenuList = () => {
  return (
    <div>
      <div className={styles.settingMenuHeader}>
        <h2>設定メニュー </h2>
      </div>
      <div className={styles.settingMenuMain}>
        {MenuItems.map((item) => (
          <MenuItem
            key={item.menuName} 
            {...item} 
          />
        ))}
      </div>
    </div>
  );
};

export default MenuList;