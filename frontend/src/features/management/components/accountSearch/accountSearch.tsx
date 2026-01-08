import { IoSearch } from "react-icons/io5";
import { useFormContext } from "react-hook-form";
import { type AccountSearchType } from "../../types/account";
import styles from "./accountSearch.module.css";

type Props = {
  onSubmit: (formData: AccountSearchType) => Promise<void>;
};

export const AccountSearch = ({ onSubmit }: Props) => {
  const { handleSubmit, register } = useFormContext<AccountSearchType>();

  return (
    <search className={styles.accountSearch}>
      <header className={styles.header}>
        <IoSearch />
        <h3>検索条件</h3>
      </header>

      <form
        id="accountSearch"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDownCapture={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
        }}
        className={styles.searchContainer}
      >
        <div className={styles.input}>
          <label htmlFor="userInput">名前・ID</label>
          <input id="userInput" type="text" {...register("query")} />
        </div>

        <div className={styles.input}>
          <label htmlFor="authority">権限</label>
          <select id="authority" {...register("authority")}>
            <option value={-1}>（選択無し）</option>
            <option value={0}>生徒</option>
            <option value={1}>教師</option>
            <option value={2}>学校管理者</option>
          </select>
        </div>

        <button type="submit" id="accountSearch">
          検索
        </button>
      </form>
    </search>
  );
};
