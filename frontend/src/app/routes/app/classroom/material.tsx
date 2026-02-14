import { MaterialCard } from "@/features/classroom/material/components/materialCard";
import { MaterialCategory } from "@/features/classroom/material/components/materialCategory";
import {
	Modal,
	type ModalHandle,
} from "@/components/ui/modal/modal";
import { useRef } from "react";
import { useParams } from "react-router";
import { RiCompass3Line } from "react-icons/ri";
import { InfoBox } from "@/components/ui/infoBox/infoBox";
import styles from "@/features/classroom/material/styles/material.module.css";
import { useClassroom } from "@/features/classroom/hooks/useClassroom";

const Material = () => {
	const { id } = useParams();
	const {
		data: classroomDetail,
		isFetching,
		isError,
	} = useClassroom(id);

	const modalRef =
		useRef<ModalHandle>(null);
	const modalButtonClick = () => {
		if (modalRef.current) {
			modalRef.current.show();
		}
	};

	const allDocuments =
		classroomDetail?.categories?.flatMap(
			(cat) => cat.documents,
		) ?? [];

	if (isFetching)
		return <p>読み込み中...</p>;
	if (isError || !classroomDetail)
		return (
			<p>教室の取得に失敗しました。</p>
		);

	return (
		<div
			className={styles.materialLayout}>
			<div
				className={
					styles.materialContainer
				}>
				<div
					className={styles.materialMain}>
					<div
						className={styles.feedWrapper}>
						<button
							onClick={modalButtonClick}
							className={styles.modalButton}>
							<div>
								<RiCompass3Line />
							</div>
						</button>
						<div
							className={styles.headerArea}>
							<h1>
								{classroomDetail.roomName}
							</h1>
							<p>
								{classroomDetail.description}
							</p>
						</div>
						<hr className={styles.divider} />
						<div className={styles.cardList}>
							{allDocuments.map((item, i) => (
								<MaterialCard
									key={i}
									item={item}
								/>
							))}
						</div>
					</div>
				</div>
				<div className={styles.materialSub}>
					<InfoBox>
						<MaterialCategory
							categories={
								classroomDetail.categories
							}
						/>
					</InfoBox>
				</div>
			</div>
			<Modal
				ref={modalRef}
				height={"fit-content"}
				width={"fit-content"}>
				<InfoBox>
					<MaterialCategory
						categories={
							classroomDetail.categories
						}
					/>
				</InfoBox>
			</Modal>
		</div>
	);
};

export default Material;
