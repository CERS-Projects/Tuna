import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Select, {
  type MultiValue,
  type StylesConfig,
  type ActionMeta,
} from "react-select";
import { type GroupsOutletContext } from "@/features/management/layouts/groupShell/groupShell";
import {
  type CreateGroupsRequestType,
  type CreateGroupsType,
  type TreeType,
  type GradeOption,
} from "@/features/management/types/group";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import { useMembers } from "@/features/management/hooks/useMember";
import styles from "@/features/management/style/groupNew.module.css";

const flattenGroups = (groups: TreeType[]): TreeType[] => {
  const flatten: TreeType[] = [];

  for (const group of groups) {
    flatten.push(group);

    if (group.branch) {
      const childGroups = flattenGroups(group.branch);
      flatten.push(...childGroups);
    }
  }

  return flatten;
};

const selectStyle: StylesConfig<GradeOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
    borderColor: state.isFocused ? "rgb(56, 94, 164)" : "#c7c7c7",
    borderWidth: state.isFocused ? "2px" : "1px",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "rgb(56, 94, 164)" : "#a0a0a0",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    height: "38px",
    padding: "0 6px",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "38px",
  }),
};

const GroupNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateGroupsType>();

  const navigate = useNavigate();
  const location = useLocation();
  const { groups, selectedGroupId, setActions } =
    useOutletContext<GroupsOutletContext>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<number[]>([]);

  const { data } = useMembers(selectedGroupId);

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

  const parentOptions = useMemo(() => flattenGroups(groups), [groups]);

  useEffect(() => {
    setActions({
      left: {
        label: "キャンセル",
        onClick: () =>
          navigate(
            { pathname: "..", search: location.search },
            { relative: "path" }
          ),
      },
      right: {
        label: "作成",
      },
    });

    return () => setActions(null);
  }, [setActions, navigate, location.search]);

  const onSubmit = async (data: CreateGroupsType) => {
    const joinedMembersId = data.members
      .filter((member) => member.isJoined)
      .map((member) => member.userId);

    const request: CreateGroupsRequestType = {
      parentGroupId: data.parentGroupId,
      newGroupName: data.newGroupName,
      members: joinedMembersId,
    };

    console.log(request);
  };

  return (
    <form
      id="newGroupForm"
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
            defaultValue={selectedGroupId || ""}
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
            {...register("newGroupName", {
              required: "グループ名は必須です。",
            })}
          />
          {errors["newGroupName"]?.message ? (
            <p className={styles.isError}>
              グループ名は必須です。入力してください。
            </p>
          ) : (
            <p>作成するグループ名を入力してください。</p>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(e.currentTarget.value);
                }
              }}
            />
          </div>

          <div className={styles.groupInfoInput}>
            <label htmlFor="selectMembers">メンバー選択</label>
            <Select
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

        <div className={styles.memberTableContainer}>
          <table className={styles.memberTable}>
            <thead>
              <tr>
                <th>ユーザID</th>
                <th>名前</th>
                <th>学年</th>
                <th>参加状況</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                data.map((member, index) => {
                  if (searchQuery) {
                    const lowerQuery = searchQuery.toLowerCase();
                    const lowerName = member.name.toLowerCase();
                    const lowerId = member.showUserId.toLowerCase();

                    if (
                      !lowerName.includes(lowerQuery) &&
                      !lowerId.includes(lowerQuery)
                    ) {
                      return null;
                    }
                  }

                  return (
                    <tr key={member.userId}>
                      <td>{member.showUserId}</td>
                      <td>{member.name}</td>
                      <td>{member.grade}年</td>
                      <td>
                        <input
                          type="checkbox"
                          {...register(`members.${index}.isJoined`)}
                        />
                      </td>
                      <td style={{ display: "none" }}>
                        <input
                          type="hidden"
                          value={member.userId}
                          {...register(`members.${index}.userId`)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};

export default GroupNew;
