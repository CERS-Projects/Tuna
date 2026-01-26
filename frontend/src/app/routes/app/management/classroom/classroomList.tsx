import { SearchBar } from "@/components/ui/search/search";
import { useState } from "react";
import { ClassroomCard } from "@/features/management/components/classroomCard/classroomCard";
import { useNavigate } from "react-router";
import commonStyles from "@/features/management/style/classroom.module.css";
import styles from "@/features/management/style/classroomList.module.css";
import { paths } from "@/config/paths";
import { useClassrooms } from "@/features/management/hooks/useClassrooms";

const ClassroomList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const { data: classrooms, isFetching, isError, refetch } = useClassrooms();

  const handleCreate = () => {
    navigate(paths.app.management.classroom.new.path);
  };

  const handleDelete = (roomId: number) => {
    const isDelete = confirm(`授業ルーム:${roomId}を削除しますか？`);

    if (isDelete) {
      alert("授業ルームを削除しました");
      refetch();
    }
  };

  return (
    <div className={commonStyles.contentsContainer}>
      <h2 className={commonStyles.sectionName}>授業ルーム一覧</h2>

      <main className={commonStyles.contents}>
        <div className={styles.toolbar}>
          <div className={styles.searchArea}>
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSearch={() => 1}
            />
          </div>

          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreate}
          >
            授業ルーム作成
          </button>
        </div>

        <div className={styles.cardsGrid}>
          {classrooms.map((c) => (
            <ClassroomCard
              key={c.roomId}
              roomId={c.roomId}
              roomName={c.roomName}
              teacherName={c.teacherName}
              latestUpdate={c.latestUpdate}
              onClick={() =>
                navigate(paths.app.management.classroom.edit.getHref(c.roomId))
              }
              onDelete={() => handleDelete(c.roomId)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ClassroomList;
