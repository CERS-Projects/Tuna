import { useCallback, useMemo } from "react";
import { findBreadcrumbPath } from "../utils/findBreadcrumbPath";
import { findGroupById } from "../utils/findGroupById";
import { type TreeType } from "../types/group";
import { type Breadcrumb } from "../types/breadcrumb";
import { useSearchParams } from "react-router";

export const useGroupNavigation = (groups: TreeType[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedGroupId = useMemo(() => {
    const raw = searchParams.get("groupId");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [searchParams]);

  const selectGroup = useCallback(
    (id: number): void => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("groupId", String(id));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

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
