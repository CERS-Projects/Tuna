import { BackPage } from "@/features/management/components/backPage/backPage";
import { paths } from "@/config/paths";

const AccountImport = () => {
  return (
    <div>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />
      account import
    </div>
  );
};

export default AccountImport;
