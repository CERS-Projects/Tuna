import React from "react";
import styles from "@/components/ui/checkbox/checkbox.module.css";
type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
  error?: string;
  linkText: string;
  linkUrl: string;
  labelTextAfterLink: React.ReactNode;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ linkText, linkUrl, labelTextAfterLink, error, id, ...props }, ref) => {
    const genId = React.useId();
    const inputId = id || `checkbox-${genId}`;
    return (
      <div className={styles.checkbox}>
        <div>
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
              <a href={linkUrl}>{linkText}</a>
              {labelTextAfterLink}
            </span>
          </label>
        </div>
        <div>
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
      </div>
    );
  }
);
