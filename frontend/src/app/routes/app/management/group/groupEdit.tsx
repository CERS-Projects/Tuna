import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import { useMembers } from "@/features/management/hooks/useMember";
import { type GroupsOutletContext } from "@/features/management/layouts/groupShell/groupShell";
import {
  type GroupRequestType,
  type GroupFormType,
} from "@/features/management/types/group";
import { flattenGroups } from "@/features/management/utils/flattenGroups";
import { findParentGroup } from "@/features/management/utils/findParentGroup";
import { GroupForm } from "@/features/management/components/groupForm/groupForm";
import styles from "@/features/management/style/groupForm.module.css";

const GroupEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { groups, selectedGroupId, setActions, currentGroup } =
    useOutletContext<GroupsOutletContext>();

  const parentGroup = useMemo(() => {
    if (!currentGroup) return null;
    return findParentGroup(groups, currentGroup.groupId);
  }, [groups, currentGroup]);

  const methods = useForm<GroupFormType>({
    defaultValues: {
      parentGroupId: parentGroup?.groupId ?? 0,
      groupName: currentGroup?.groupName ?? "",
      members: [],
    },
  });

  const { reset } = methods;

  const parentOptions = useMemo(
    () => flattenGroups(groups, selectedGroupId, { excludeDescendants: true }),
    [groups, selectedGroupId],
  );

  const [selectedGrade, setSelectedGrade] = useState<number[]>([]);

  // ダミーでschoolIdを1に設定
  const { data: members } = useMembers(1, selectedGroupId);

  useEffect(() => {
    if (members && currentGroup) {
      reset({
        parentGroupId: parentGroup?.groupId ?? 0,

        groupName: currentGroup.groupName ?? "",

        members: members.map((member) => ({
          ...member,
          isJoined: member.isJoined ?? false,
        })),
      });
    }

    setSelectedGrade([]);
  }, [members, currentGroup, parentGroup, reset]);

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
            { relative: "path" },
          ),
      },
      right: {
        label: "更新",
      },
    });

    return () => setActions(null);
  }, [setActions, navigate, location.search]);

  const onSubmit = async (formData: GroupFormType) => {
    const members = Array.isArray(formData.members) ? formData.members : [];

    const joinedMembersId = members
      .filter((member) => member.isJoined)
      .map((member) => member.userId);

    const request: GroupRequestType = {
      parentGroupId: formData.parentGroupId,
      groupName: formData.groupName.trim(),
      members: joinedMembersId,
    };

    console.log(request);
  };

  if (!currentGroup) {
    return (
      <div className={styles.form}>
        <p>指定されたグループが存在しないため、編集できません。</p>
        <button
          type="button"
          onClick={() =>
            navigate(
              { pathname: "..", search: location.search },
              { relative: "path" },
            )
          }
        >
          一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <GroupForm
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        parentOptions={parentOptions}
        members={members ?? null}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};

export default GroupEdit;
