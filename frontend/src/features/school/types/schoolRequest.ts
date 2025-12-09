export type SchoolDto = {
  schoolName: string;
  schoolCode: string;
  schoolAddress: string;
  schoolMailAddress: string;
};

export type CreateTeacherDto = {
  showUserId: string;
  name: string;
  mailAddress: string;
  password: string;
};

export type SchoolRequestType = {
  schoolDto: SchoolDto;
  createTeacherDto: CreateTeacherDto;
};
