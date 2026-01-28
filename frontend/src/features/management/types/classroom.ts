export type ClassroomItem = {
  roomId: number;
  roomName: string;
  teacherName: string;
  latestUpdate: string;
};

export type ClassroomCategoryDocument = {
  name: string;
  path: string;
  uploadDate: string;
};

export type ClassroomCategory = {
  category: string;
  documents: ClassroomCategoryDocument[];
};

export type ClassroomCreateInput = {
  roomName: string;
  description: string;
  categories: {
    category: string;
    files: File[];
  }[];
};
