import { Typography } from 'antd';

import Head from 'next/head'
import Image from 'next/image'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import useUser from '../utils/hooks/useUser';
import { useStudentHomework } from '../utils/hooks/useHomework';
import { StudentHome } from '../components/StudentHome';
import { TeacherHome } from '../components/TeacherHome';

const { Title, Paragraph, Text } = Typography

const Home: NextPage = () => {
  const { user } = useUser()

  const { homework, mutateHomework } = useStudentHomework()

  return (
    <>
      {user?.userType === 'student' && <StudentHome />}
      {user?.userType === 'teacher' && <TeacherHome />}
    </>
  )
}

export default Home
