import Select, { type MultiValue, type ActionMeta } from "react-select";
import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { type GroupFormType, type GradeOption } from "../../types/group";
import type { Member } from "../../types/member";
import { MemberTable } from "../memberTable/memberTable";
import { selectStyle } from "../../style/multiSelectStyle";
import styles from "./groupForm.module.css";

type Props = {
  selectedGrade: number[];
  setSelectedGrade: (grade: number[]) => void;
  members: Member[] | null;
};

export const MemberManagementSection = ({
  selectedGrade,
  setSelectedGrade,
  members,
}: Props) => {
  const { setValue } = useFormContext<GroupFormType>();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const gradeOptions: GradeOption[] = useMemo(() => {
    if (!members) return [];
    const uniqueGrades = [...new Set(members.map((m) => m.grade))].sort(
      (a, b) => a - b
    );
    return uniqueGrades.map((grade) => ({ value: grade, label: `${grade}年` }));
  }, [members]);

  const currentGradeOptions = useMemo(
    () => gradeOptions.filter((o) => selectedGrade.includes(o.value)),
    [gradeOptions, selectedGrade]
  );

  return (
    <div className={styles.groupMemberInfo}>
      <h3>メンバー管理</h3>
      <p>検索してメンバーを追加・削除します。</p>

      <div className={styles.memberSearchContainer}>
        <div className={styles.groupInfoInput}>
          <label htmlFor="inputSearchMembers">メンバー検索</label>
          <input
            id="inputSearchMembers"
            type="text"
            placeholder="IDか名前を検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.groupInfoInput}>
          <label htmlFor="selectMembers">メンバー選択</label>
          <Select
            value={currentGradeOptions}
            options={gradeOptions}
            id="selectMembers"
            placeholder="学年を選択..."
            isClearable
            isMulti
            onChange={(
              newValue: MultiValue<GradeOption>,
              actionMeta: ActionMeta<GradeOption>
            ) => {
              const newGrades = newValue.map((option) => option.value);
              setSelectedGrade(newGrades);

              if (!members) return;

              if (actionMeta.action === "select-option" && actionMeta.option) {
                const targetGrade = actionMeta.option.value;
                members.forEach((member, index) => {
                  if (member.grade === targetGrade) {
                    setValue(`members.${index}.isJoined`, true);
                  }
                });
              }

              if (
                actionMeta.action === "remove-value" &&
                actionMeta.removedValue
              ) {
                const targetGrade = actionMeta.removedValue.value;
                members.forEach((member, index) => {
                  if (member.grade === targetGrade) {
                    setValue(`members.${index}.isJoined`, false);
                  }
                });
              }

              if (actionMeta.action === "clear") {
                members.forEach((member, index) => {
                  if (selectedGrade.includes(member.grade)) {
                    setValue(`members.${index}.isJoined`, false);
                  }
                });
              }
            }}
            styles={selectStyle}
          />
        </div>
      </div>

      <MemberTable members={members} searchQuery={searchQuery} />
    </div>
  );
};
