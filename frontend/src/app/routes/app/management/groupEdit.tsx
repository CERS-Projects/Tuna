import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Select, { type MultiValue, type ActionMeta } from "react-select";
import { MemberTable } from "@/features/management/components/memberTable/memberTable";
import { type GroupsOutletContext } from "@/features/management/layouts/groupShell/groupShell";
import {
  type GroupRequestType,
  type GroupFormType,
  type GradeOption,
} from "@/features/management/types/group";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import { useMembers } from "@/features/management/hooks/useMember";
import { flattenGroups } from "@/features/management/utils/flattenGroups";
import { findParentGroup } from "@/features/management/utils/findParentGroup";
import styles from "@/features/management/style/groupForm.module.css";
import { selectStyle } from "@/features/management/style/multiSelectStyle";

const GroupEdit = () => {
  const { groups, selectedGroupId, setActions, currentGroup } =
    useOutletContext<GroupsOutletContext>();

  const parentGroup = useMemo(() => {
    if (!currentGroup) return null;
    return findParentGroup(groups, currentGroup.id);
  }, [groups, currentGroup]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<GroupFormType>({
    defaultValues: {
      parentGroupId: parentGroup?.id ?? 0,
      groupName: currentGroup?.name ?? "",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<number[]>([]);

  // ダミーでschoolIdを1に設定
  const { data } = useMembers(1, selectedGroupId);

  const gradeOptions: GradeOption[] = useMemo(() => {
    if (!data) return [];
    const allGrades = data.map((member) => member.grade);
    const uniqueGrades = [...new Set(allGrades)];
    uniqueGrades.sort((a, b) => a - b);
    return uniqueGrades.map((grade) => ({
      value: grade,
      label: `${grade}年`,
    }));
  }, [data]);

  const currentGradeOptions = useMemo(() => {
    return gradeOptions.filter((option) =>
      selectedGrade.includes(option.value)
    );
  }, [gradeOptions, selectedGrade]);

  const parentOptions = useMemo(() => flattenGroups(groups), [groups]);

  useEffect(() => {
    if (data && currentGroup) {
      reset({
        parentGroupId: parentGroup?.id ?? 0,

        groupName: currentGroup.name ?? "",

        members: data.map((member) => ({
          ...member,
          isJoined: member.isJoined ?? false,
        })),
      });
    }

    setSelectedGrade([]);
  }, [data, currentGroup, parentGroup, reset]);

  useEffect(() => {
    setActions({
      left: {
        label: "削除",
        onClick: () => console.log("選択されたグループ削除"),
      },
      middle: {
        label: "キャンセル",
        onClick: () =>
          navigate(
            { pathname: "..", search: location.search },
            { relative: "path" }
          ),
      },
      right: {
        label: "更新",
      },
    });

    return () => setActions(null);
  }, [setActions, navigate, location.search]);

  const onSubmit = async (data: GroupFormType) => {
    const joinedMembersId = data.members
      .filter((member) => member.isJoined)
      .map((member) => member.userId);

    const request: GroupRequestType = {
      parentGroupId: data.parentGroupId,
      groupName: data.groupName,
      members: joinedMembersId,
    };

    console.log(request);
  };

  return (
    <form
      id="editGroupForm"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}
    >
      <div className={styles.groupBasicInfo}>
        <div className={styles.groupInfoInput}>
          <label htmlFor="selectParent">親グループを選択</label>
          <select
            id="selectParent"
            {...register("parentGroupId", { required: true })}
          >
            <option value={0}>（選択なし）</option>
            {parentOptions.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <p>このグループが所属する上位グループを選択してください。</p>
        </div>

        <div className={styles.groupInfoInput}>
          <label htmlFor="newGroupName">グループ名</label>
          <input
            type="text"
            id="newGroupName"
            placeholder="新しいグループ名を入力"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
            }}
            {...register("groupName", {
              required: "グループ名は必須です。",
            })}
          />
          {errors["groupName"]?.message ? (
            <p className={styles.isError}>
              グループ名は必須です。入力してください。
            </p>
          ) : (
            <p>変更する場合はグループ名を入力してください。</p>
          )}
        </div>
      </div>

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

                if (!data) return;

                if (
                  actionMeta.action === "select-option" &&
                  actionMeta.option
                ) {
                  const targetGrade = actionMeta.option.value;
                  data.forEach((member, index) => {
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
                  data.forEach((member, index) => {
                    if (member.grade === targetGrade) {
                      setValue(`members.${index}.isJoined`, false);
                    }
                  });
                }

                if (actionMeta.action === "clear") {
                  data.forEach((member, index) => {
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

        <MemberTable
          data={data}
          searchQuery={searchQuery}
          register={register}
        />
      </div>
    </form>
  );
};

export default GroupEdit;
