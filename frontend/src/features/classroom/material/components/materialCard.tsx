import styles from "./materialCard.module.css";
import { type materialType } from "../types/material";
import { MdOutlinePictureAsPdf, MdFileDownload } from "react-icons/md";

type MaterialProps = {
	item: materialType;
};

export const MaterialCard = ({ item }: MaterialProps) => {
	return (
		<div className={styles.materialCard}>
			<a href={item.documentUrl} download={item.documentName}>
				<div className={styles.materialContent}>
					<div className={styles.titleArea}>
						<h3>{item.documentName}</h3>
					</div>
					<hr className={styles.divider} />
					<div className={styles.fileMeta}>
						<MdOutlinePictureAsPdf className={styles.pdfIcon} />
						<span className={styles.fileName}>{item.documentName}</span>
						<MdFileDownload className={styles.downloadIcon} />
					</div>
				</div>
			</a>
		</div>
	);
};
