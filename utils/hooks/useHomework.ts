import useSWR from "swr";
import { Homework, StudentHomework } from "../types";

export function useStudentHomework() {
  const { data, mutate } = useSWR<Array<StudentHomework>>('/api/homework/student/my')

  return { homework: data, mutateHomework: mutate }
}

export function useTeacherHomework() {
  const { data, mutate } = useSWR<Array<Homework>>('/api/homework/teacher/my')

  return { homework: data, mutateHomework: mutate }
}

