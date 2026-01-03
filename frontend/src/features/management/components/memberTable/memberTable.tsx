import { useFormContext } from "react-hook-form";
import { type GroupFormType } from "../../types/group";
import { type Member } from "../../types/member";
import styles from "./memberTable.module.css";

type Props = {
  members: Member[] | null;
  searchQuery: string;
};

export const MemberTable = ({ members, searchQuery }: Props) => {
  const { register } = useFormContext<GroupFormType>();

  return (
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
          {members ? (
            members.map((member, index) => {
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
  );
};
