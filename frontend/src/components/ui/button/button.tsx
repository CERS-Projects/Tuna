import styles from "./button.module.css";
import React from "react";

export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
