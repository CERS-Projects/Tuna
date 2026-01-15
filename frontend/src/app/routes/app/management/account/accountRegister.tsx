import { BackPage } from "@/features/management/components/backPage/backPage";
import { paths } from "@/config/paths";

const AccountRegister = () => {
  return (
    <div>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />
      account register
    </div>
  );
};

export default AccountRegister;
