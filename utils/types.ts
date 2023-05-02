import { classRow, studentRow } from "./user";

export type User = {
  actual_id: string;   // 登录名
  isLoggedIn: boolean;
  name: string;   // 登录名，如果有显示名称则会被覆盖
  userType: UserType;
  token: string;
};

export type UserType = "student" | "teacher";

export interface StudentHomework extends Homework {
  completed: boolean;
}

export interface Homework {
  id: number;
  title: string;
  assignment: string;
  time: string;
  deadline: string;
  teacher: string;
  courseName: string;
  courseID: number;
}

export interface HomeworkDetail {
  title: string;
  assignment: string;
  time: string;
  deadline: string;
}

export interface HomeworkDetailContent {
  completed: boolean;
  accomplishment?: {
    time: string;
    content: string;
  };
  judge?: {
    score: number;
    comment: string;
  };
}

export interface HomeworkStudentDetail {
  detail: HomeworkDetail;
  content: HomeworkDetailContent;
}

export interface HomeworkTeacherDetailContent extends HomeworkDetailContent {
  contentId: number;
  studentName: string;
}

export interface HomeworkTeacherDetail {
  detail: HomeworkDetail;
  content: Array<HomeworkTeacherDetailContent>;
}

export type ResponseResult =
  | string
  | Homework[]
  | UpdateResult
  | studentRow[]
  | classRow[]
  | User;

export interface JsonResponse<T = ResponseResult> {
  code: number;
  result: T;
}

export interface UpdateResult {
  affected: number;
}

export interface Course {
  id: number;
  name: string;
  time: string;
  ended: boolean;
  teacherID: number;
  teacherName: string;
}

export interface UserDetail {
  actualID: string;
  name: string;
}

export type TeacherUserDetail = UserDetail;

export interface StudentUserDetail extends UserDetail {
  class: string;
}

export interface Exam {
  id: number;
  name: string;
  time: string;
  endtime: string;
  location: string;
  courseID: number;
  courseName: string;
}

export interface ExamResult {
  id: number;
  studentID: number;
  studentName: string;
  score: number | null;
}

export type ExamAssginRequestBody = {
  title: string;
  location: string;
  time: string;
  endtime: string;
  courseID: number;
}

export type HomeworkContentScore = {
  id: number;
  completed?: boolean;
  score?: number;
  homeworkID: number;
  homeworkTitle: string;
}

export type ExamContentScore = {
  id: number;
  score?: number;
  examID: number;
  examName: string;
}

export type HomeworkTotalScore = {
  studentID: number;
  studentName: string;
  completionRate: number;
  averageScore: number;
};

export type ExamTotalScore = {
  studentID: number;
  studentName: string;
  averageScore: number;
};
