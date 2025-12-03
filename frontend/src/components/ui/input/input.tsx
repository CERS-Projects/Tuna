import React from "react";
import styles from "./input.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  error?: string;
  width?: string | number;
  height?: string | number;
  containerStyle?: React.CSSProperties;
};

export const Input = ({
  label,
  error,
  id,
  width,
  height,
  containerStyle,
  ref,
  ...props
}: InputProps) => {
  const genId = React.useId();
  const inputId = id || `input-${genId}`;

  return (
    <div className={styles.inputContainer} style={{ width, ...containerStyle }}>
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
        style={{ height }}
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
