export type PostDetailResponse = {
  postId: string;
  userId: number;
  sentence: string;
  imageUrl?: string[];
  shareRange: number[];
  postDate: Date | string;
  likeCount: number;
  responseCount: number;
  nickname: string;
  showUserId: string;
  icon: string;
  isLiked: boolean;
  isBookmarked: boolean;
};

export type PostData = PostDetailResponse & {
  isLink?: boolean;
};

export type CreatePostRequest = {
  sentence: string;
  imageFile?: File[];
  shareRange: number[];
  responseTo?: string;
};

export type PostFormData = {
  sentence: string;
  shareRange: number[];
  responseTo?: string;
};

export type ImageData = {
  url: string;
  file: File;
};
