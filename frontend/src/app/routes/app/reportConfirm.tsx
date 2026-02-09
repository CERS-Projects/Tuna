import { PostReportConfirm } from "@/features/report/components/postReportConfirm/postReportConfirm";
import { paths } from "@/config/paths";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { type ReportLocationState } from "@/features/report/types/report";

const ReportConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReportLocationState;
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!state) {
      navigate(paths.app.report.root.getHref(), { replace: true });
    }
  }, [state, navigate]);
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(
        now.getHours(),
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const payload = {
        school_id: state.school_id,
        report_date: formattedDate,
        report_by: state.report_by,
        reported_user: state.reported_user,
        reason_id: state.reason_id,
        reported_post_id: state.reported_post_id,
        detail: state.detail,
        post_content: state.post_content,
      };

      console.log("API送信:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCompleted(true);
    } catch (error) {
      console.error("API送信失敗:", error);
      alert("通報が完了しませんでした");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    navigate(paths.app.report.root.getHref(), {
      state: {
        ...state,
      },
    });
  };
  const handleReturnToTimeline = () => {
    navigate(paths.app.timeline.getHref(), { replace: true });
  };
  return (
    <div>
      <PostReportConfirm
        isLoading={isLoading}
        reportRadioValue={state.reason_id}
        reportTextValue={state.detail}
        userId={state.reported_user}
        postContent={state.post_content}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isCompleted={isCompleted}
        onReturnToTimeline={handleReturnToTimeline}
      />
    </div>
  );
};

export default ReportConfirm;
