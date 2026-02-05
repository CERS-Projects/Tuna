import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button/button";
import { ReportRadio } from "@/features/report/components/postReportForm/reportRadio/reportRadio";
import { ReportText } from "@/features/report/components/postReportForm/reportText/reportText";
import styles from "@/features/report/styles/report.module.css";

import {
  REPORT_LIMITS,
  REPORT_MESSAGES,
  REPORT_OPTIONS,
  DEFAULT_REPORT_VALUE,
} from "@/features/report/reportConstants";
import { type ReportLocationState } from "@/features/report/types/report";
import { paths } from "@/config/paths";

type ReportFormData = {
  reason: string;
  detail: string;
};

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedState = location.state as ReportLocationState | null;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<ReportFormData>({
    defaultValues: {
      reason: savedState?.reason ?? DEFAULT_REPORT_VALUE,
      detail: savedState?.detail ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    trigger("detail");
  }, [trigger]);

  const detailValue = watch("detail");

  const onSubmit = (data: ReportFormData) => {
    navigate(paths.app.report.confirm.getHref(), {
      replace: true,
      state: {
        report_id: savedState?.report_id || 1,
        school_id: savedState?.school_id || 1,
        report_date: undefined,
        report_by: savedState?.report_by || "testabc123",
        reported_user: savedState?.reported_user || "testdef456",
        reason: data.reason,
        detail: data.detail,
        post_content: savedState?.post_content || "投稿内容仮のデータです。",
      },
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} id="reportForm">
        <section>
          <ReportRadio
            options={REPORT_OPTIONS}
            register={register("reason", {
              required: true,
            })}
          />
        </section>

        <section>
          <ReportText
            register={register("detail", {
              required: REPORT_MESSAGES.REQUIRED,
              minLength: {
                value: REPORT_LIMITS.MIN_LENGTH,
                message: REPORT_MESSAGES.TOO_SHORT,
              },
              maxLength: REPORT_LIMITS.MAX_LENGTH,
            })}
            error={errors.detail}
          />
          <div className={styles.textCountArea}>
            {errors.detail?.message && (
              <span
                className={styles.errorMessage}
                id="reportTextError"
                role="alert"
              >
                {errors.detail.message}
              </span>
            )}
            <span className={styles.countNumber}>
              {detailValue.length}/{REPORT_LIMITS.MAX_LENGTH}
            </span>
          </div>
        </section>

        <div className={styles.nextButtonContainer}>
          <Button
            type="submit"
            width="80px"
            height="35px"
            fontSize="1rem"
            disabled={!isValid}
          >
            次へ
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Report;
