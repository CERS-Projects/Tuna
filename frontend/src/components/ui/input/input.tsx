import React from "react";
import styles from "./input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  error?: string;
  width?: number;
  height?: number;
};

export const Input = ({
  label,
  error,
  id,
  width,
  height,
  ref,
  ...props
}: InputProps) => {
  const genId = React.useId();
  const inputId = id || `input-${genId}`;

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={error ? styles.inputError : styles.input}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{ width, height }}
        {...props}
      />
      {error && (
        <span
          id={`${inputId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
