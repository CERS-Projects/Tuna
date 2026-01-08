import { AccountSearch } from "@/features/management/components/accountSearch/accountSearch";
import { FormProvider, useForm } from "react-hook-form";
import { type AccountSearchType } from "@/features/management/types/account";
import styles from "@/features/management/style/accountList.module.css";

const AccountList = () => {
  const methods = useForm<AccountSearchType>({
    defaultValues: {
      query: "",
      authority: undefined,
    },
  });

  const onSubmit = async (formData: AccountSearchType) => {
    console.log("data", formData);
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.contents}>
        <AccountSearch onSubmit={onSubmit} />
      </div>
    </FormProvider>
  );
};

export default AccountList;
