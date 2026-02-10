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
  reasonId: string;
  detail: string;
};

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedState = location.state as ReportLocationState | null;

  useEffect(() => {
    if (!savedState) {
      navigate(-1);
    }
  }, [savedState, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<ReportFormData>({
    defaultValues: {
      reasonId: String(savedState?.reasonId ?? DEFAULT_REPORT_VALUE),
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
        reportedUser: savedState?.reportedUser || 1111,
        reasonId: Number(data.reasonId),
        reportedPostId: String(savedState?.reportedPostId) || "1",
        detail: data.detail,
        postContent: savedState?.postContent || "投稿内容仮のデータです。",
      },
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} id="reportForm">
        <section>
          <ReportRadio
            options={REPORT_OPTIONS}
            register={register("reasonId", {
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
