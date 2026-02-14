export type Classroom = {
	roomId: string;
	teacherName: string;
	roomName: string;
	description: string;
	latestUpdate: string;
};

export type NoticeInfoItem = {
	noticeId: string;
	groupId: number;
	noticeTitle: string;
	noticeContent: string;
	noticeDate: string;
	teacherName: string;
};
