import { Avatar, Card, Divider, Tag, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import parseMysqlDateTime from '../utils/parseTime';
import { Homework, StudentHomework } from '../utils/types';
import Link from 'next/link';
import useUser from '../utils/hooks/useUser';

const { Text } = Typography

export function HomeworkCard({ homework }: { homework: Homework | StudentHomework; }): JSX.Element {
  const time = parseMysqlDateTime(homework.time)
  const deadline = parseMysqlDateTime(homework.deadline);
  const currtime = new Date(Date.now())

  const { user } = useUser()

  return (
    <Card title={
      <>
        {homework.title}
        {
          ((homework as StudentHomework).completed
          && <Tag
            icon={<CheckCircleOutlined />}
            color='success'
            style={{
              marginLeft: 8,
              verticalAlign: 'middle'
            }}
          >已完成</Tag>) || (
            currtime > deadline
            && <Tag
            style={{
              marginLeft: 8,
              verticalAlign: 'middle'
            }}
          >已过期</Tag>
          )
        }
      </>}
      extra={<Link href={`homeworkDetail/${homework.id}`}>查看</Link>}
      style={{ marginBottom: 16, display: 'block' }}>
      <Text>发布时间：{time.toLocaleString()}</Text><br />
      <Text>截止时间：{deadline.toLocaleString()}</Text>
      <Divider style={{ margin: '16px 0px' }} />
      <div>
        <Avatar size={'small'} icon={<UserOutlined />} style={{ marginTop: -4 }} />
        <Text style={{ marginLeft: 12 }}><b>{homework.teacher}</b>布置的作业</Text>
      </div>
    </Card>
  );
}
