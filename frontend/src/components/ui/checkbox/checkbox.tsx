import React, { useState } from "react";
import styles from "@/components/ui/checkbox/checkbox.module.css";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  error?: string;
  linkText?: string;
  linkUrl?: string;
  onLinkClick?: () => void;
  labelTextAfterLink?: React.ReactNode;
};

export const Checkbox = ({
  ref,
  id,
  error,
  linkText,
  linkUrl,
  onLinkClick,
  labelTextAfterLink,
  ...props
}: CheckboxProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const genId = React.useId();
  const inputId = id || `checkbox-${genId}`;

  return (
    <div className={styles.checkbox}>
      <label htmlFor={inputId} className={styles.checkboxLabel}>
        <input
          id={inputId}
          type="checkbox"
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <span>
          {linkUrl ? (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          ) : (
            <span
              className={
                isClicked ? styles.activeTermsModal : styles.termsModal
              }
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.();
                if (isClicked === false) {
                  setIsClicked(true);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {linkText}
            </span>
          )}

          {labelTextAfterLink}
        </span>
      </label>

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
