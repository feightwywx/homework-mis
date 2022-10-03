import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { JsonResponse, User } from "../types"

export default function useUser() {
  const { data: userJson, mutate: mutateUser } = useSWR<JsonResponse<User>>('/api/user/info')

  const user = userJson?.result;
  useEffect(() => {
    if (!user) return        //  未加载，什么也不做

    if (!user.isLoggedIn) {  // 如果未登录，跳转到登录页
      Router.push('/login');
    } else if (user.isLoggedIn && Router.pathname === '/login') {   // 如果已登录但是在登录页
      Router.push('/');                                             // 跳转到主页
    }
  }, [user])

  return { user, mutateUser }
}
