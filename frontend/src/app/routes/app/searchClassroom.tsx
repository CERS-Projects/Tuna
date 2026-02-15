import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { SelectClassroom } from "@/features/searchClassroom/components/selectClassroom";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/searchClassroom/styles/searchClassroom.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef, useMemo } from "react";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { SearchBar } from "@/components/ui/search/search";
import { useClassrooms } from "@/features/searchClassroom/hooks/useClassrooms";
import { useState } from "react";
import type { NoticeInfoItem } from "@/features/searchClassroom/types/SelectClassroom";

const dummyInfo: NoticeInfoItem[] = [
	{
		noticeId: 1,
		groupId: 101,
		noticeTitle: "【重要】明日の時間割変更について",
		noticeContent:
			"明日の3限と4限が入れ替わります。各自、教科書の忘れ物がないように注意してください。",
		noticeDate: "2024-03-25",
		teacherName: "佐藤 健二",
	},
	{
		noticeId: 2,
		groupId: 102,
		noticeTitle: "春季講習の申し込み受付開始",
		noticeContent:
			"来月の春季講習の受付を開始しました。マイページより希望する科目を選択して申し込んでください。",
		noticeDate: "2024-03-24",
		teacherName: "田中 美咲",
	},
	{
		noticeId: 3,
		groupId: 101,
		noticeTitle: "数学の中間テスト範囲について",
		noticeContent:
			"来週のテスト範囲は教科書P.45〜P.80までとなります。問題集も並行して進めておいてください。",
		noticeDate: "2024-03-22",
		teacherName: "佐藤 健二",
	},
	{
		noticeId: 4,
		groupId: 105,
		noticeTitle: "忘れ物のお知らせ（筆箱）",
		noticeContent:
			"3階の自習室に青色の筆箱の忘れ物がありました。心当たりのある人は受付まで来てください。",
		noticeDate: "2024-03-21",
		teacherName: "事務局",
	},
	{
		noticeId: 5,
		groupId: 103,
		noticeTitle: "英検二次試験対策講座の案内",
		noticeContent:
			"二次試験に進む生徒を対象に、面接対策の特別講座を実施します。参加希望者は担当まで。",
		noticeDate: "2024-03-20",
		teacherName: "高橋 浩一",
	},
];

const SearchClassroom = () => {
	const modalRef = useRef<ModalHandle>(null);
	const modalButtonClick = () => {
		if (modalRef.current) {
			modalRef.current.show();
		}
	};

	const [query, setQuery] = useState<string>("");
	const { data: classrooms = [], isFetching, isError } = useClassrooms();

	const filteredClassrooms = useMemo(() => {
		if (!query.trim()) return classrooms;
		return classrooms.filter((classroom) =>
			classroom.roomName.toLowerCase().includes(query.toLowerCase()),
		);
	}, [classrooms, query]);

	return (
		<div className={styles.searchClassroomLayout}>
			<div className={styles.searchClassroomContainer}>
				<div className={styles.searchClassroomMain}>
					<div className={styles.mainTop}>
						<button onClick={modalButtonClick} className={styles.modalButton}>
							<RiCompass3Line />
						</button>
						<SearchBar
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onSearch={() => {}}
						/>
					</div>
					<div className={styles.mainBottom}>
						{isFetching ? (
							<p>読み込み中...</p>
						) : isError ? (
							<p>教室の取得に失敗しました。</p>
						) : filteredClassrooms.length > 0 ? (
							filteredClassrooms.map((classroom) => (
								<SelectClassroom key={classroom.roomId} {...classroom} />
							))
						) : (
							<p>該当する教室が見つかりませんでした。</p>
						)}
					</div>
				</div>
				<div className={styles.searchClassroomSub}>
					<InfoBox>
						<NoticeInfo items={dummyInfo} />
					</InfoBox>
				</div>
			</div>
			<Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
				<InfoBox>
					<NoticeInfo items={dummyInfo} />
				</InfoBox>
			</Modal>
		</div>
	);
};

export default SearchClassroom;
