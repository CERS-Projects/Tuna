import { useFormContext } from "react-hook-form";
import { MemberManagementSection } from "./memberManagementSection";
import { GroupBasicInfo } from "./groupBasicInfo";
import { type GroupFormType, type TreeType } from "../../types/group";
import type { Member } from "../../types/member";
import styles from "../../style/groupForm.module.css";

type Props = {
  selectedGrade: number[];
  setSelectedGrade: (grade: number[]) => void;
  parentOptions: TreeType[];
  members: Member[] | null;
  onSubmit: (formData: GroupFormType) => Promise<void>;
};

export const GroupForm = ({
  selectedGrade,
  setSelectedGrade,
  parentOptions,
  members,
  onSubmit,
}: Props) => {
  const { handleSubmit } = useFormContext<GroupFormType>();

  return (
    <form
      id="groupForm"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}
    >
      <GroupBasicInfo parentOptions={parentOptions} />

      <MemberManagementSection
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        members={members ?? null}
      />
    </form>
  );
};
