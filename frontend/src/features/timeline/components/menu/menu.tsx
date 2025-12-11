import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { Navigate } from "react-router";
import { PiHouseLight } from "react-icons/pi";
import styles from "./menu.module.css";

export const Menu = () => {
  return (
    <div className={styles.menuContainer}>
      <button onClick={() => Navigate("")}>
        <PiHouseLight />
      </button>
      <button onClick={() => Navigate("")} className={styles.menuButton}>
        <HiOutlineMagnifyingGlass />
      </button>
      <button onClick={() => Navigate("")} className={styles.menuButton}>
        <IoSchoolOutline />
      </button>
      <button onClick={() => Navigate("")} className={styles.menuButton}>
        <LuCirclePlus />
      </button>
      <button onClick={() => Navigate("")} className={styles.menuButton}>
        <AiOutlineSolution />
      </button>
      <button onClick={() => Navigate("")} className={styles.menuButton}>
        <BsBookmark />
      </button>
    </div>
  );
};
