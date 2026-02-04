import { PostReportConfirm } from "@/features/userReport/components/postReportConfirm/postReportConfirm";
import { paths } from "@/config/paths";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { type ReportLocationState } from "@/features/userReport/reportTypes";

const ReportConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReportLocationState;
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!state) {
      navigate(paths.app.postReport.root.getHref(), { replace: true });
    }
  }, [state, navigate]);
  if (!state) {
    return null;
  }
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      console.log("API送信:", state);
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
    navigate(paths.app.postReport.root.getHref(), {
      state: {
        reportRadioValue: state.reportRadioValue,
        reportTextValue: state.reportTextValue,
        userID: state.userID,
        postContent: state.postContent,
        isCorrection: true,
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
        reportRadioValue={state.reportRadioValue}
        reportTextValue={state.reportTextValue}
        userID={state.userID}
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
