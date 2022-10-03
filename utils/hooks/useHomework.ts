import useSWR from "swr";
import { Homework, JsonResponse, StudentHomework } from "../types";

export function useStudentHomework() {
  const { data, mutate } = useSWR<JsonResponse<StudentHomework[]>>('/api/homework/student/my')

  return { homework: data?.result, mutateHomework: mutate }
}

export function useTeacherHomework() {
  const { data, mutate } = useSWR<JsonResponse<Homework[]>>('/api/homework/teacher/my')

  return { homework: data?.result, mutateHomework: mutate }
}

