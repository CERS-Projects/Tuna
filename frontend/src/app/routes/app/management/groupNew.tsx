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
import { GroupForm } from "@/features/management/components/groupForm/groupForm";

const GroupNew = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { groups, selectedGroupId, setActions } =
    useOutletContext<GroupsOutletContext>();

  const methods = useForm<GroupFormType>({
    defaultValues: {
      parentGroupId: selectedGroupId || 0,
      members: [],
    },
  });

  const { setValue } = methods;

  const parentOptions = useMemo(() => flattenGroups(groups, null), [groups]);

  const [selectedGrade, setSelectedGrade] = useState<number[]>([]);

  // ダミーでschoolIdを1に設定
  const { data: members } = useMembers(1);

  useEffect(() => {
    setValue("parentGroupId", selectedGroupId ?? 0);
  }, [selectedGroupId, setValue]);

  useEffect(() => {
    if (!members) return;
    setValue(
      "members",
      members.map((m) => ({
        ...m,
        isJoined: false,
      }))
    );
  }, [members, setValue]);

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

  const onSubmit = async (formData: GroupFormType) => {
    const members = Array.isArray(formData.members) ? formData.members : [];

    const joinedMembersId = members
      .filter((member) => member.isJoined)
      .map((member) => member.userId);

    const request: GroupRequestType = {
      parentGroupId: formData.parentGroupId,
      groupName: formData.groupName,
      members: joinedMembersId,
    };

    console.log(request);
  };

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

export default GroupNew;
