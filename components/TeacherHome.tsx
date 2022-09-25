import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Space, Typography, TreeSelect } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import HwLayout from './layout';
import useUser from '../utils/hooks/useUser';
import { useTeacherHomework } from '../utils/hooks/useHomework';
import parseMysqlDateTime from '../utils/parseTime';
import { HomeworkCard } from './HomeworkCard';
import { ReactEventHandler, useState } from 'react';
import moment, { Moment } from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';
import { useRouter } from 'next/router';

const { Text, Title } = Typography

const { TextArea } = Input

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

export function TeacherHome(): JSX.Element {
  const { user } = useUser();
  const router = useRouter()

  const { homework } = useTeacherHomework();

  const currtime = new Date(Date.now())
  const hour = currtime.getHours();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current < moment().startOf('day');
  };

  async function assignClickHandler(values: {
    title: string,
    assignment: string,
    deadline: Moment
  }) {
    const deadline = values.deadline.format('YYYY-MM-DD HH:mm:ss');
    console.log(values);
    // setConfirmLoading(true);

    // fetch(`/api/homework/teacher/assign`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     title: values.title,
    //     assignment: values.assignment,
    //     deadline: deadline
    //   })
    // }).then(res => {
    //   setConfirmLoading(false);
    //   setModalOpen(false);
    //   // router.reload();
    // }).catch(err => {
    //   console.error(err)
    // })
  }

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
          <Button
            type='primary'
            shape='round'
            icon={<FormOutlined />}
            style={{ float: 'right' }}
            onClick={() => { setModalOpen(true); }}>下发作业</Button>
          <Title level={5} style={{ float: 'left' }}>进行中作业</Title>
        </div>
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
      <Modal
        open={modalOpen}
        title='作业布置'
        onCancel={() => { setModalOpen(false); }}
        width={'80vw'}
        confirmLoading={confirmLoading}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              // form.resetFields();
              assignClickHandler(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          autoComplete='off'
          requiredMark='optional'>
          <Form.Item
            label='作业标题'
            name='title'
            rules={[{
              required: true,
            }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label='作业描述'
            name='assignment'
            rules={[{
              required: true,
            }]}>
            <TextArea
              rows={10}
              showCount
            />
          </Form.Item>
          <Form.Item
            label='截止日期'
            name='deadline'
            rules={[{
              required: true,
            }]}>
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            label='布置对象'
            name='target'
            rules={[{
              required: true,
            }]}>
              <TreeSelect
              treeData={treeData}
              treeCheckable
              showCheckedStrategy={SHOW_PARENT}
               />
            </Form.Item>
        </Form>
      </Modal>
    </HwLayout>);
}
