import { Spin } from "antd"
import { useRouter } from "next/router"
import { useEffect } from "react"
import HwLayout from "../components/layout"

function Error() {
  // FIXME 生产环境构建，多次切换不同种类用户会出现一个刷新页面即可恢复的bug
  const route = useRouter()

  useEffect(() => {
    if (route) {
      setTimeout(() => {
        route.reload()
      }, 500)
    }
  }, [route])

  return (
    <Spin tip='请稍候，加载页面的时间比以往稍长...'>
      <HwLayout>
      </HwLayout>
    </Spin>
  )
}

export default Error;
