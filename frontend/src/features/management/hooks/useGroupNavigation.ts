import { useState, useCallback, useMemo } from "react";
import { findBreadcrumbPath } from "../utils/findBreadcrumbPath";
import { type TreeType } from "../types/group";
import { type Breadcrumb } from "../types/breadcrumb";

const findGroupById = (
  groups: TreeType[],
  targetId: number
): TreeType | undefined => {
  for (const group of groups) {
    if (group.id === targetId) return group;
    const targetGroup: TreeType | undefined = group.branch
      ? findGroupById(group.branch, targetId)
      : undefined;
    if (targetGroup) return targetGroup;
  }

  return undefined;
};

export const useGroupNavigation = (groups: TreeType[]) => {
  const [requestedGroupId, setRequestedGroupId] = useState<number | null>(null);

  const selectGroup = useCallback((id: number): void => {
    setRequestedGroupId(id);
  }, []);

  const { breadcrumbs, currentGroup, selectedGroupId } = useMemo(() => {
    if (!groups || groups.length === 0) {
      return {
        breadcrumbs: [] as Breadcrumb[],
        currentGroup: undefined as TreeType | undefined,
        selectedGroupId: null as number | null,
      };
    }

    const fallbackId = groups[0].id;
    const targetId = requestedGroupId ?? fallbackId;

    const path =
      findBreadcrumbPath(groups, targetId) ??
      findBreadcrumbPath(groups, fallbackId) ??
      [];

    if (path.length === 0) {
      return {
        breadcrumbs: [],
        currentGroup: undefined,
        selectedGroupId: null,
      };
    }

    const resolvedId = path[path.length - 1].id;

    return {
      breadcrumbs: path,
      currentGroup: findGroupById(groups, resolvedId),
      selectedGroupId: resolvedId,
    };
  }, [groups, requestedGroupId]);

  return {
    breadcrumbs,
    currentGroup,
    selectedGroupId,
    selectGroup,
  };
};
