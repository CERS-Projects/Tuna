import styles from "./button.module.css";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  width?: string;
  height?: string;
  fontSize?: string;
};
export const Button = ({
  children,
  width,
  height,
  ref,
  fontSize,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      className={styles.button}
      style={{ width, height, fontSize }}
      {...props}
    >
      {children}
    </button>
  );
};
