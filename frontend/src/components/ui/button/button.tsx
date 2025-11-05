import styles from "./button.module.css";

export const Button = ({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
