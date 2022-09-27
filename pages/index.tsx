import type { NextPage } from 'next'
import useUser from '../utils/hooks/useUser';
import { StudentHome } from '../components/StudentHome';
import { TeacherHome } from '../components/TeacherHome';


const Home: NextPage = () => {
  const { user } = useUser()

  return (
    <>
      {user?.userType === 'student' && <StudentHome />}
      {user?.userType === 'teacher' && <TeacherHome />}
    </>
  )
}

export default Home
