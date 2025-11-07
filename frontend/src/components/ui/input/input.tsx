import React from "react";
import styles from "./input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  error?: string;
};

export const Input = ({ label, error, id, ref, ...props }: InputProps) => {
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
        className={error ? styles.InputError : styles.Input}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
