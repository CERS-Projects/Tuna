import { useState, useEffect } from "react";
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
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentGroup, setCurrentGroup] = useState<TreeType>();

  const selectGroup = (id: number): void => {
    setSelectedGroupId(id);
  };

  useEffect(() => {
    if (!groups || groups.length === 0) {
      setBreadcrumbs([]);
      setCurrentGroup(undefined);
      setSelectedGroupId(null);
      return;
    }

    const fallbackId = groups[0].id;
    const targetId = selectedGroupId ?? fallbackId;

    const path =
      findBreadcrumbPath(groups, targetId) ??
      findBreadcrumbPath(groups, fallbackId);

    if (!path || path.length === 0) {
      setBreadcrumbs([]);
      setCurrentGroup(undefined);
      setSelectedGroupId(null);
      return;
    }

    setBreadcrumbs(path);

    const resolvedId = path[path.length - 1].id;
    setCurrentGroup(findGroupById(groups, resolvedId));

    if (selectedGroupId !== resolvedId) {
      setSelectedGroupId(resolvedId);
    }
  }, [groups, selectedGroupId]);

  return {
    breadcrumbs,
    currentGroup,
    selectGroup,
  };
};
