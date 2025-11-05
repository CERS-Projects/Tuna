import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router";
import styles from "./header.module.css";
import { paths } from "@/config/paths";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>Tuna</header>
      <Link to={paths.help.category.gethref()} className={styles.helpIcon}>
        <FaQuestionCircle />
      </Link>
    </div>
  );
};
