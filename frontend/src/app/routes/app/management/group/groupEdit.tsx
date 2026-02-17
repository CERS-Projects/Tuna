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
import { Spinner } from "@/components/ui/spinner/spinner";
import styles from "@/features/management/style/groupForm.module.css";
import { useDeleteGroup } from "@/features/management/hooks/useDeleteGroup";
import { paths } from "@/config/paths";

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

  const { reset, getValues } = methods;

  const parentOptions = useMemo(
    () => flattenGroups(groups, selectedGroupId, { excludeDescendants: true }),
    [groups, selectedGroupId],
  );

  const [selectedGrade, setSelectedGrade] = useState<number[]>([]);

  const { data: members } = useMembers(selectedGroupId);
  const { mutate: deleteGroupMutate, isPending } = useDeleteGroup();

  useEffect(() => {
    if (members && currentGroup) {
      reset({
        parentGroupId: parentGroup?.groupId ?? 0,

        groupName: currentGroup.groupName ?? "",

        members: members.map((member) => ({
          ...member,
          isJoined: member.isJoin ?? false,
        })),
      });
    }

    setSelectedGrade([]);
  }, [members, currentGroup, parentGroup, reset]);

  useEffect(() => {
    setActions({
      left: {
        label: "削除",
        onClick: () => {
          const currentFormData = getValues();

          if (currentGroup?.groupId) {
            deleteGroupMutate(
              {
                groupId: currentGroup?.groupId,
                parentId: currentFormData.parentGroupId,
              },
              {
                onSuccess: () => {
                  window.alert("グループ削除に成功しました");
                  navigate(paths.app.management.group.root.path);
                },
                onError: () => window.alert("グループ削除に失敗しました"),
              },
            );
          } else {
            window.alert("グループ削除に失敗しました");
          }
        },
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
  }, [
    setActions,
    navigate,
    location.search,
    getValues,
    currentGroup,
    deleteGroupMutate,
  ]);

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
      {isPending && <Spinner isDark={true} />}
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
