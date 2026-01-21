export type categoryType = {
  id: number;
  name: string;
  createdAt: string;
};

export type materialType = {
  categoryId: number;
  materialId: number;
  title: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
};

export type classroomData = {
  className: string;
  information: string;
};
