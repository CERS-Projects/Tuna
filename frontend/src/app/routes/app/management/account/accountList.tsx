import { useEffect, useState } from "react";
import { useAccounts } from "@/features/management/hooks/useAccounts";
import { AccountSearch } from "@/features/management/components/accountSearch/accountSearch";
import { AccountTable } from "@/features/management/components/accountTable/accountTable";
import { FormProvider, useForm } from "react-hook-form";
import { type AccountSearchType } from "@/features/management/types/account";
import styles from "@/features/management/style/accountList.module.css";

const AccountList = () => {
  const methods = useForm<AccountSearchType>({
    defaultValues: {
      query: "",
      authority: -1,
    },
  });

  const [searchInfo, setSearchInfo] = useState<AccountSearchType>({
    query: "",
    authority: -1,
  });

  const {
    data: accounts,
    isFetching,
    isError,
    refetch,
  } = useAccounts(searchInfo);

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
        <AccountSearch onSubmit={onSubmit} />
        <AccountTable accounts={accounts} />
      </div>
    </FormProvider>
  );
};

export default AccountList;
