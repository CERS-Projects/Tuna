export type Classroom = {
  roomId: number;
  teacherName: string;
  roomName: string;
  description: string;
  latestUpdate: string;
};

export type NoticeInfoItem = {
  noticeId: number;
  groupId: number;
  noticeTitle: string;
  noticeContent: string;
  noticeDate: string;
  teacherName: string;
};
