import styles from "./groupCard.module.css";

type Props = {
  name: string;
  member: number | undefined;
  subGroups: number | undefined;
  handleSelectGroup: () => void;
};

export const GroupCard = ({
  name,
  member,
  subGroups,
  handleSelectGroup,
}: Props) => {
  return (
    <button className={styles.groupCard} onClick={handleSelectGroup}>
      <h3 className={styles.groupName}>{name}</h3>

      <hr />

      <ul className={styles.groupDetail}>
        <li>{`${member ?? 0} members`}</li>
        <li>{`${subGroups ?? 0} sub-groups`}</li>
      </ul>
    </button>
  );
};
