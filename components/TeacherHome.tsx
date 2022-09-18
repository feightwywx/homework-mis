import { Button, Col, Divider, Row, Space, Typography } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import HwLayout from './layout';
import useUser from '../utils/hooks/useUser';
import { useTeacherHomework } from '../utils/hooks/useHomework';
import parseMysqlDateTime from '../utils/parseTime';
import { HomeworkCard } from './HomeworkCard';

const { Text, Title } = Typography

export function TeacherHome(): JSX.Element {
  const { user } = useUser();

  const { homework } = useTeacherHomework();

  const currtime = new Date(Date.now())
  const hour = currtime.getHours();

  return (
    <HwLayout>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Title style={{ marginBottom: '16px' }}>{
          hour < 5 ? '夜深了' : (
            hour > 5 && hour < 9 ? '早上好' : (
              hour < 12 ? '上午好' : (
                hour < 14 ? '中午好' : (
                  hour < 18 ? '下午好' : (
                    hour < 22 ? '晚上好' : '夜深了'
                  )
                )
              )
            )
          )

        }，{user?.name}</Title>
        <Title level={4} style={{ marginTop: 0 }}>{(() => {
          const filtered = homework?.filter(
            item => currtime <= parseMysqlDateTime(item.deadline)
          );
          if (filtered
            && filtered.length !== 0
          ) {
            return `目前已经下发了${filtered.length}项作业。`;
          } else {
            return '目前没有正在进行的作业。';
          }
        })()}</Title>
        <Divider />
        <div>
          <Button type='primary' shape='round' icon={<FormOutlined />} style={{ float: 'right' }}>下发作业</Button>
          <Title level={5} style={{ float: 'left' }}>进行中作业</Title>
        </div>
        <Row gutter={16}>
          {(() => {
            const filtered = homework?.filter(
              item => currtime <= parseMysqlDateTime(item.deadline)
            );
            return filtered?.length ? (
              filtered.map((item, index) => (
                <Col span={8} key={index}>
                  <HomeworkCard homework={item} />
                </Col>
              ))
            ) : (
              <Col span={8} style={{ marginBottom: 12 }}>
                <Text>暂时还没有进行中作业～</Text>
              </Col>
            );
          })()}
        </Row>
        <Title level={5}>已过期作业</Title>
        <Row gutter={16}>
          {(() => {
            const filtered = homework?.filter(
              item => currtime > parseMysqlDateTime(item.deadline)
            );
            return filtered?.length ? (
              filtered.map((item, index) => (
                <Col span={8} key={index}>
                  <HomeworkCard homework={item} />
                </Col>
              ))
            ) : (
              <Col span={8} style={{ marginBottom: 12 }}>
                <Text>暂时还没有已过期作业～</Text>
              </Col>
            );
          })()}
        </Row>
      </Space>
    </HwLayout>);
}
