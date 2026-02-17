import { useEffect, useState } from "react";
import { useAccounts } from "@/features/management/hooks/useAccounts";
import { AccountSearch } from "@/features/management/components/accountSearch/accountSearch";
import { AccountTable } from "@/features/management/components/accountTable/accountTable";
import { FormProvider, useForm } from "react-hook-form";
import { type AccountSearchType } from "@/features/management/types/account";
import styles from "@/features/management/style/accountList.module.css";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";

const AccountList = () => {
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";

  const methods = useForm<AccountSearchType>({
    defaultValues: {
      query: "",
      authority: -2,
    },
  });

  const [searchInfo, setSearchInfo] = useState<AccountSearchType>({
    query: "",
    authority: -2,
  });

  const {
    data: accounts,
    isFetching,
    isError,
    refetch,
  } = useAccounts(searchInfo);

  if (isError) {
    return (
      <div className={styles.contents}>アカウントの取得に失敗しました</div>
    );
  }

  useEffect(() => {
    refetch();
  }, [searchInfo, refetch]);

  const onSubmit = async (formData: AccountSearchType) => {
    console.log("data", formData);
    setSearchInfo(formData);
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.contents}>
        <AccountSearch onSubmit={onSubmit} role={role} />
        {isFetching ? <Spinner /> : <AccountTable accounts={accounts} />}
      </div>
    </FormProvider>
  );
};

export default AccountList;
