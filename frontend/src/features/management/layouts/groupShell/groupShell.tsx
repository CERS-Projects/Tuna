import { useLocation, useNavigate, Outlet } from "react-router";
import { useMemo, useCallback, useState } from "react";
import { useGroups } from "@/features/management/hooks/useGroups";
import { useGroupNavigation } from "@/features/management/hooks/useGroupNavigation";
import { Tree } from "@/features/management/components/tree/tree";
import { Breadcrumbs } from "@/features/management/components/breadcrumbs/breadcrumbs";
import { FaPen, FaPlus } from "react-icons/fa";
import styles from "./groupShell.module.css";

export type GroupsShellAction = {
  label: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

export type GroupsShellActions = {
  left?: GroupsShellAction;
  middle?: GroupsShellAction;
  right?: GroupsShellAction;
};

export type GroupsOutletContext = ReturnType<typeof useGroups> & {
  breadcrumbs: ReturnType<typeof useGroupNavigation>["breadcrumbs"];
  currentGroup: ReturnType<typeof useGroupNavigation>["currentGroup"];
  selectedGroupId: ReturnType<typeof useGroupNavigation>["selectedGroupId"];
  selectGroup: ReturnType<typeof useGroupNavigation>["selectGroup"];
  setActions: (actions: GroupsShellActions | null) => void;
};

const GroupShell = () => {
  const { groups, isFetching, isError } = useGroups(1);
  const { breadcrumbs, currentGroup, selectedGroupId, selectGroup } =
    useGroupNavigation(groups);

  const navigate = useNavigate();
  const location = useLocation();

  const [actions, setActions] = useState<GroupsShellActions | null>(null);

  const mode = useMemo<"group" | "edit" | "new">(() => {
    const p = location.pathname;
    if (p.endsWith("/edit")) return "edit";
    if (p.endsWith("/new")) return "new";
    return "group";
  }, [location.pathname]);

  const title = useMemo(() => {
    if (mode === "edit") return "グループ編集";
    if (mode === "new") return "グループ作成";
    return "グループ一覧";
  }, [mode]);

  const outletContext = useMemo(
    () => ({
      groups,
      isFetching,
      isError,
      breadcrumbs,
      currentGroup,
      selectedGroupId,
      selectGroup,
      setActions,
    }),
    [
      groups,
      isFetching,
      isError,
      breadcrumbs,
      currentGroup,
      selectedGroupId,
      selectGroup,
      setActions,
    ]
  );

  const handleGoEdit = useCallback(() => {
    if (!currentGroup?.id) return;
    navigate({ pathname: "edit", search: location.search });
  }, [currentGroup?.id, navigate, location.search]);

  const handleGoNew = useCallback(() => {
    navigate({ pathname: "new", search: location.search });
  }, [navigate, location.search]);

  const defaultIndexActions = useMemo<GroupsShellActions>(
    () => ({
      left: {
        label: "グループ編集",
        onClick: handleGoEdit,
        disabled: !currentGroup?.id,
      },
      right: {
        label: "グループ作成",
        onClick: handleGoNew,
      },
    }),
    [handleGoEdit, handleGoNew, currentGroup?.id]
  );

  const effectiveActions = useMemo<GroupsShellActions | null>(() => {
    return mode === "group" ? actions ?? defaultIndexActions : actions;
  }, [mode, actions, defaultIndexActions]);

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionName}>{title}</h2>

      <header className={styles.menuContainer}>
        <Breadcrumbs breadcrumbs={breadcrumbs} handleSelect={selectGroup} />
        <div className={styles.actions}>
          {effectiveActions?.left && (
            <button
              type="button"
              onClick={effectiveActions.left.onClick}
              disabled={effectiveActions.left.disabled}
            >
              {mode === "group" && <FaPen />}
              {effectiveActions.left.label}
            </button>
          )}

          {effectiveActions?.middle && (
            <button
              type="button"
              onClick={effectiveActions.middle.onClick}
              disabled={effectiveActions.middle.disabled}
            >
              {effectiveActions.middle.label}
            </button>
          )}

          {effectiveActions?.right && (
            <button
              type={mode === "new" || mode === "edit" ? "submit" : "button"}
              form={
                mode === "new"
                  ? "newGroupForm"
                  : mode === "edit"
                  ? "editGroupForm"
                  : undefined
              }
              onClick={effectiveActions.right.onClick}
              disabled={effectiveActions.right.disabled}
            >
              {mode === "group" && <FaPlus />}
              {effectiveActions.right.label}
            </button>
          )}
        </div>
      </header>

      <hr />

      <div className={styles.groupInfoContainer}>
        <aside className={styles.groupTree}>
          <Tree
            items={groups}
            level={0}
            currentId={currentGroup?.id}
            handleBranchClick={selectGroup}
          />
        </aside>
        <div className={styles.groupInfo}>
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
};

export default GroupShell;
