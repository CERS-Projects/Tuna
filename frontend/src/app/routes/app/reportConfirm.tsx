import { PostReportConfirm } from "@/features/report/components/postReportConfirm/postReportConfirm";
import { paths } from "@/config/paths";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { type ReportLocationState } from "@/features/report/types/report";
import { REPORT_OPTIONS } from "@/features/report/reportConstants";

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
      const payload = {
        reportedUser: state.reportedUser,
        reasonId: state.reasonId,
        detail: state.detail,
        reportedPostId: state.reportedPostId,
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
  const selectedOptionLabel =
    REPORT_OPTIONS.find((option) => option.value === state.reasonId)?.label ||
    String(state.reasonId);
  return (
    <div>
      <PostReportConfirm
        isLoading={isLoading}
        reportRadioValue={selectedOptionLabel}
        reportTextValue={state.detail}
        userId={state.reportedUser}
        postContent={state.postContent}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isCompleted={isCompleted}
        onReturnToTimeline={handleReturnToTimeline}
      />
    </div>
  );
};

export default ReportConfirm;
