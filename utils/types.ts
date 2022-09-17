export type User = {
  isLoggedIn: boolean;
  name: string;
  userType: UserType;
  token: string;
};

export type UserType = 'student' | 'teacher';

export type Homework = {
  id: number;
  title: string;
  assignment: string;
  deadline: string;
}
