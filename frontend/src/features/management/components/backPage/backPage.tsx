import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router";
import styles from "./backPage.module.css";

type Props = {
  to: string;
  label: string;
};

export const BackPage = ({ to, label }: Props) => {
  return (
    <Link to={to} className={styles.backPage}>
      <FaChevronLeft />
      {label}
    </Link>
  );
};
