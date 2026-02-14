export type ClassroomItem = {
	roomId: string;
	roomName: string;
	teacherName: string;
	latestUpdate: string;
};

export type ClassroomCategoryDocument = {
	documentId: string;
	documentName: string;
	documentUrl: string;
	uploadedAt: string;
};

export type ClassroomCategory = {
	categoryName: string;
	documents: ClassroomCategoryDocument[];
};

export type ClassroomCategoryEdit = {
	categoryId: string;
	categoryName: string;
	existingDocuments: ClassroomCategoryDocument[];
	deleteDocuments: ClassroomCategoryDocument[];
	newFiles: File[];
};

export type ClassroomCategoryEditPost = {
	categoryId: string;
	categoryName: string;
	existingDocuments: ClassroomCategoryDocument[];
	deleteDocuments: ClassroomCategoryDocument[];
	newFiles: File[];
};

export type ClassroomType = {
	roomId: string;
	roomName: string;
	description: string;
	categories: ClassroomCategory[];
};

export type ClassroomCreateInput = {
	roomName: string;
	description: string;
	categories: {
		categoryName: string;
		files: File[];
	}[];
};

export type ClassroomEditInput = {
	roomId: string;
	roomName: string;
	description: string;
	categories: ClassroomCategoryEdit[];
};

export type ClassroomEditPost = {
	roomId: string;
	roomName: string;
	description: string;
	updateCategories: ClassroomCategoryEditPost[];
	newCategories: ClassroomNewCategoryPost[];
	deleteCategoryIds: string[];
};

export type ClassroomNewCategoryPost = {
	categoryName: string;
	files: File[];
};
