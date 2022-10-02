import { classRow, studentRow } from "./user";

export type User = {
  isLoggedIn: boolean;
  name: string;
  userType: UserType;
  token: string;
};

export type UserType = 'student' | 'teacher';

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
  }
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

export type ResponseResult = string
  | Homework[]
  | UpdateResult
  | studentRow[]
  | classRow[]
  | User

export interface JsonResponse<T = ResponseResult> {
  code: number;
  result: T;
}

export interface UpdateResult {
  affected: number
}
