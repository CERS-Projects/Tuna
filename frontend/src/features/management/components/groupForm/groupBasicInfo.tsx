import { useFormContext } from "react-hook-form";
import { type GroupFormType, type TreeType } from "../../types/group";
import styles from "../../style/groupForm.module.css";

type Props = {
  parentOptions: TreeType[];
};

export const GroupBasicInfo = ({ parentOptions }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<GroupFormType>();

  return (
    <div className={styles.groupBasicInfo}>
      <div className={styles.groupInfoInput}>
        <label htmlFor="selectParent">親グループを選択</label>
        <select
          id="selectParent"
          {...register("parentGroupId", {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option value={0}>（選択なし）</option>
          {parentOptions.map((group) => (
            <option key={group.groupId} value={group.groupId}>
              {group.groupName}
            </option>
          ))}
        </select>
        <p>このグループが所属する上位グループを選択してください。</p>
      </div>

      <div className={styles.groupInfoInput}>
        <label htmlFor="inputGroupName">グループ名</label>
        <input
          type="text"
          id="inputGroupName"
          placeholder="グループ名を入力"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
          }}
          {...register("groupName", {
            required: "グループ名は必須です。",
            validate: (value) =>
              value.trim().length > 0 ||
              "グループ名は空白のみでは登録できません。",
          })}
        />

        {errors["groupName"]?.message ? (
          <p className={styles.isError}>{errors["groupName"].message}</p>
        ) : (
          <p>グループ名を入力してください。</p>
        )}
      </div>
    </div>
  );
};
