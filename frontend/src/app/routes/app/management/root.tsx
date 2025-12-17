import { Outlet } from "react-router";
import { ManagementLayout } from "@/components/layouts/managementLayout/managementLayout";

export const ErrorBoundary = () => {
  return <div>エラーが発生しました。管理画面の表示に問題が発生しました。</div>;
};

const ManagementRoot = () => {
  return (
    <ManagementLayout>
      <Outlet />
    </ManagementLayout>
  );
};

export default ManagementRoot;
