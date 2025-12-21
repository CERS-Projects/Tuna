import { Fragment } from "react/jsx-runtime";
import { type Breadcrumb } from "../../types/breadcrumb";
import styles from "./breadcrumbs.module.css";

type Props = {
  breadcrumbs: Breadcrumb[];
  handleSelect: (id: number) => void;
};

export const Breadcrumbs = ({ breadcrumbs, handleSelect }: Props) => {
  return (
    <nav className={styles.breadcrumbsContainer}>
      <ul className={styles.breadcrumbs}>
        {breadcrumbs.map((item, index) => (
          <Fragment key={`${item.id}`}>
            <li onClick={() => handleSelect(item.id)}>{item.crumb}</li>
            {index !== breadcrumbs.length - 1 && "/"}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
