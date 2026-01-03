import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { useNavigate } from "react-router";
import { PiHouseLight } from "react-icons/pi";
import styles from "./menu.module.css";

export const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.menuContainer}>
      <button onClick={() => navigate("")}>
        <PiHouseLight />
      </button>
      <button onClick={() => navigate("")} className={styles.menuButton}>
        <HiOutlineMagnifyingGlass />
      </button>
      <button onClick={() => navigate("")} className={styles.menuButton}>
        <IoSchoolOutline />
      </button>
      <button onClick={() => navigate("")} className={styles.menuButton}>
        <LuCirclePlus />
      </button>
      <button onClick={() => navigate("")} className={styles.menuButton}>
        <AiOutlineSolution />
      </button>
      <button onClick={() => navigate("")} className={styles.menuButton}>
        <BsBookmark />
      </button>
    </div>
  );
};
