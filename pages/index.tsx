import type { NextPage } from 'next'
import useUser from '../utils/hooks/useUser';
import { StudentHome } from '../components/StudentHome';
import { TeacherHome } from '../components/TeacherHome';
import { Spin } from 'antd';


const Home: NextPage = () => {
  const { user } = useUser()

  return (
    <>
      {
        user ? (
          <>
            {user?.userType === 'student' && <StudentHome />}
            {user?.userType === 'teacher' && <TeacherHome />}
          </>
        ) :
        // 可能显示在左侧，而非中央
          <div style={{ margin: '32px', textAlign: 'center' }}>
            <Spin ></Spin>
          </div>
      }
    </>
  )
}

export default Home
