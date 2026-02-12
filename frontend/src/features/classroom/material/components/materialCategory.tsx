import { useState } from "react";
import styles from "./materialCategory.module.css";
import {
	MdKeyboardArrowRight,
	MdOutlinePictureAsPdf,
	MdFileDownload,
} from "react-icons/md";

import { type materialType, type categoryType } from "../types/material";

type CategoryWithDocuments = categoryType & {
	documents: materialType[];
};

type MaterialProps = {
	categories: CategoryWithDocuments[];
};

export const MaterialCategory = ({ categories }: MaterialProps) => {
	const [openIndexes, setOpenIndexes] = useState<number[]>([]);

	const toggleCategory = (index: number) => {
		setOpenIndexes((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
		);
	};

	return (
		<div className={styles.container}>
			{categories.map((category, index) => {
				const isOpen = openIndexes.includes(index);
				return (
					<div key={index} className={styles.section}>
						<button
							className={`${styles.header} ${isOpen ? styles.headerActive : ""}`}
							onClick={() => toggleCategory(index)}
							aria-expanded={isOpen}>
							<MdKeyboardArrowRight
								className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
							/>
							<span className={styles.title}>{category.categoryName}</span>
						</button>
						<div
							className={`${styles.gridWrapper} ${isOpen ? styles.gridWrapperOpen : ""}`}
							aria-hidden={!isOpen}>
							<div className={styles.overflowInner}>
								<div className={styles.contentList}>
									{category.documents.map((item, i) => (
										<a
											key={i}
											href={item.documentUrl}
											download={item.documentName}
											className={styles.pdfLink}>
											<div className={styles.pdfMain}>
												<MdOutlinePictureAsPdf className={styles.pdfIcon} />
												<span className={styles.fileName}>
													{item.documentName}
												</span>
											</div>
											<div className={styles.pdfSub}>
												<span className={styles.date}>{item.uploadedAt}</span>
												<MdFileDownload className={styles.downloadIcon} />
											</div>
										</a>
									))}
									{category.documents.length === 0 && (
										<p className={styles.noData}>
											公開されている資料はありません
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
