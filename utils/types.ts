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
