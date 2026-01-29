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

export type ClassroomCategoryEdit = {
  category: string;
  existingDocuments: ClassroomCategoryDocument[];
  deleteDocuments: ClassroomCategoryDocument[];
  newFiles: File[];
};

export type ClassroomCategoryEditPost = {
  category: string;
  deleteDocuments: ClassroomCategoryDocument[];
  newFiles: File[];
};

export type ClassroomType = {
  roomId: number;
  roomName: string;
  description: string;
  categories: ClassroomCategory[];
};

export type ClassroomCreateInput = {
  roomName: string;
  description: string;
  categories: {
    category: string;
    files: File[];
  }[];
};

export type ClassroomEditInput = {
  roomId: number;
  roomName: string;
  description: string;
  categories: ClassroomCategoryEdit[];
};

export type ClassroomEditPost = {
  roomId: number;
  roomName: string;
  description: string;
  categories: ClassroomCategoryEditPost[];
};
