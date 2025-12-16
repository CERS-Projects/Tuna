import styles from "@/features/management/style/groupManagement.module.css";
import { MenuDrawer } from "@/features/management/components/menuDrawer/menuDrawer";

const GroupManagement = () => {
  return <MenuDrawer isOpen={true} onClose={() => 1} />;
};

export default GroupManagement;
