import { Col, Divider, Row, Space, Spin, Typography } from 'antd';
import HwLayout from './layout';
import useUser from '../utils/hooks/useUser';
import { useStudentHomework } from '../utils/hooks/useHomework';
import parseMysqlDateTime from '../utils/parseTime';
import { HomeworkCard } from './HomeworkCard';

const { Text, Title } = Typography

export function StudentHome(): JSX.Element {
  const { user } = useUser();

  const { homework } = useStudentHomework();

  const currtime = new Date(Date.now())
  const hour = currtime.getHours();

  return (
    <HwLayout>
      <Spin spinning={!(user && homework)}>
        {homework && <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Title style={{ marginBottom: '16px' }}>{
            hour < 5 ? '夜深了' : (
              hour < 9 ? '早上好' : (
                hour < 12 ? '上午好' : (
                  hour < 14 ? '中午好' : (
                    hour < 18 ? '下午好' : (
                      hour < 22 ? '晚上好' : '夜深了'
                    )
                  )
                )
              )
            )

          }，{user?.name}同学</Title>
          <Title level={4} style={{ marginTop: 0 }}>{(() => {
            const filtered = homework?.filter(
              item => currtime <= parseMysqlDateTime(item.deadline)
            );
            if (filtered
              && filtered.length !== 0
              && (filtered.length - filtered.filter(x => x.completed).length) !== 0) {
              return `目前还有${filtered.length - filtered.filter(x => x.completed).length}项作业需要完成，加油！`;
            } else {
              return '目前没有要完成的作业哦，过段时间再来看看吧～';
            }
          })()}</Title>
          <Divider />
          <Title level={5}>进行中作业</Title>
          <Row gutter={16}>
            {(() => {
              const filtered = homework?.filter(
                item => currtime <= parseMysqlDateTime(item.deadline)
              );
              return filtered?.length ? (
                filtered.map((item, index) => (
                  <Col xs={24} md={12} xl={8} key={index}>
                    <HomeworkCard homework={item} />
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ marginBottom: 12 }}>
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
                  <Col xs={24} md={12} xl={8} key={index}>
                    <HomeworkCard homework={item} />
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ marginBottom: 12 }}>
                  <Text>暂时还没有已过期作业～</Text>
                </Col>
              );
            })()}
          </Row>
        </Space>
        }
      </Spin>
    </HwLayout>);
}
