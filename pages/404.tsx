import { useRouter } from "next/router"
import { useEffect } from "react"
import HwLayout from "../components/layout"

function Error() {
  const route = useRouter()

  useEffect(() => {
    if (route) {
      setTimeout(() => {
        route.push('/')
      }, 3000)
    }
  }, [route])

  return (
    <HwLayout>
      <p>404 - 页面不存在</p>
      <p>正在跳转到首页...</p>
    </HwLayout>
  )
}

export default Error;
