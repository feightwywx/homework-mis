export type User = {
  isLoggedIn: boolean
  name: string
  userType: UserType
  token: string
}

export type UserType = 'student' | 'teacher'