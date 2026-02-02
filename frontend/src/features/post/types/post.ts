export type PostData = {
  postId: number;
  showUserId: string;
  userName: string;
  iconUrl?: string;
  mainPost: string;
  goodCount: number;
  commentCount: number;
  goodCheck: boolean;
  bookmarkCheck: boolean;
  postTo: string;
  userTo: string;
  postImgs?: string[];
  responseTo?: number;
  isLink?: boolean;
};

export type CreatePostRequest = {
  sentence: string;
  imageFile?: File[];
  shareRange: number[];
  responseTo?: number;
};

export type PostFormData = {
  sentence: string;
  shareRange: number[];
  responseTo?: number;
};

export type ImageData = {
  url: string;
  file: File;
};
