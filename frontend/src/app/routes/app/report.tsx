import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button/button";
import { ReportRadio } from "@/features/userReport/components/postReportForm/reportRadio";
import { ReportText } from "@/features/userReport/components/postReportForm/reportText";
import styles from "@/features/userReport/styles/report.module.css";

import {
  REPORT_LIMITS,
  REPORT_MESSAGES,
  REPORT_OPTIONS,
  DEFAULT_REPORT_VALUE,
} from "@/features/userReport/reportConstants";
import { type ReportLocationState } from "@/features/userReport/reportTypes";
import { paths } from "@/config/paths";

const PostReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedState = location.state as ReportLocationState | null;

  const [reportRadioValue, setReportRadioValue] = useState(
    savedState?.reportRadioValue ?? DEFAULT_REPORT_VALUE,
  );
  const [reportTextValue, setReportTextValue] = useState(
    savedState?.reportTextValue ?? "",
  );
  const isTooShort = reportTextValue.length < REPORT_LIMITS.MIN_LENGTH;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isTooShort) return;
    window.history.replaceState(null, "");
    navigate(paths.app.postReport.confirm.getHref(), {
      state: {
        reportRadioValue,
        reportTextValue,
        userID: savedState?.userID || "@test_user_id",
        postContent:
          savedState?.postContent || " これはテスト用の投稿です。あいうえお",
      },
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} id="reportForm">
        <section>
          <ReportRadio
            options={REPORT_OPTIONS}
            selectedValue={reportRadioValue}
            onChange={setReportRadioValue}
          />
        </section>

        <section>
          <ReportText
            textValue={reportTextValue}
            onChange={setReportTextValue}
            isError={isTooShort}
          />
          <div className={styles.textCountArea}>
            {isTooShort && (
              <span
                className={styles.errorMessage}
                id="reportTextError"
                role="alert"
              >
                {REPORT_MESSAGES.TOO_SHORT}
              </span>
            )}
            <span className={styles.countNumber}>
              {reportTextValue.length}/{REPORT_LIMITS.MAX_LENGTH}
            </span>
          </div>
        </section>

        <div className={styles.nextButtonContainer}>
          <Button
            type="submit"
            width="80px"
            height="35px"
            fontSize="1rem"
            disabled={isTooShort}
          >
            次へ
          </Button>
        </div>
      </form>
    </div>
  );
};
export default PostReportForm;
