import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button/button";
import { ReportRadio } from "@/features/userReport/components/postReportForm/reportRadio/reportRadio";
import { ReportText } from "@/features/userReport/components/postReportForm/reportText/reportText";
import styles from "@/features/userReport/styles/report.module.css";

import {
  REPORT_LIMITS,
  REPORT_MESSAGES,
  REPORT_OPTIONS,
  DEFAULT_REPORT_VALUE,
} from "@/features/userReport/reportConstants";
import { type ReportLocationState } from "@/features/userReport/types/report";
import { paths } from "@/config/paths";

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedState = location.state as ReportLocationState | null;

  const [reportRadioValue, setReportRadioValue] = useState(
    savedState?.reason ?? DEFAULT_REPORT_VALUE,
  );
  const [reportTextValue, setReportTextValue] = useState(
    savedState?.detail ?? "",
  );
  const isTooShort = reportTextValue.length < REPORT_LIMITS.MIN_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isTooShort) return;
    navigate(paths.app.report.confirm.getHref(), {
      replace: true,
      state: {
        report_id: savedState?.report_id || 1,
        school_id: savedState?.school_id || 1,
        report_date: undefined,
        report_by: savedState?.report_by || "testabc123",
        reported_user: savedState?.reported_user || "testdef456",
        reason: reportRadioValue,
        detail: reportTextValue,
        post_content: "投稿内容仮のデータです。",
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
export default Report;
