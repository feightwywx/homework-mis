import { Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Space, Typography, TreeSelect, TreeSelectProps, message, Spin } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import HwLayout from './layout';
import useUser from '../utils/hooks/useUser';
import { useTeacherHomework } from '../utils/hooks/useHomework';
import parseMysqlDateTime from '../utils/parseTime';
import { HomeworkCard } from './HomeworkCard';
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { RangePickerProps } from 'antd/lib/date-picker';
import useSWR from 'swr';
import { DefaultOptionType } from 'antd/lib/select';
import { Key } from 'antd/lib/table/interface';
import { JsonResponse } from '../utils/types';
import { classRow } from '../utils/user';

const { Text, Title } = Typography

const { TextArea } = Input

export function TeacherHome(): JSX.Element {
  const { user } = useUser();

  const { homework, mutateHomework } = useTeacherHomework();

  const currtime = new Date(Date.now())
  const hour = currtime.getHours();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current < moment().startOf('day');
  };

  // 获取班级
  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
  const { data: classNamesJson } = useSWR<JsonResponse<classRow[]>>(treeData.length === 0 ? '/api/user/class' : null);
  const classNames = classNamesJson?.result

  useEffect(() => {
    if (Array.isArray(classNames)) {
      setTreeData(classNames.map((item, index) => ({
        id: ++index,
        pId: 0,
        key: item.class,
        value: item.class,
        title: item.class,
        isLeaf: false
      })))
    }
  }, [classNames])

  function genNode(id: number, item: { id: number, name: string }) {
    return {
      id: Math.random().toString(36).substring(2, 6),
      pId: id,
      key: item.id,
      value: item.id,
      title: item.name,
      isLeaf: true
    }
  }

  const onLoadData: TreeSelectProps['loadData'] = ({ id, value }) => (
    fetch(`/api/user/student/${value}`, {
      method: 'POST'
    }).then(res =>
      res.json()
    ).then(json => {
      const childArray = (json as JsonResponse<{ id: number, name: string }[]>).result
      if (Array.isArray(childArray)) {
        const childNodes = childArray.map((item) => (
          genNode(id, item)
        ))
        setTreeData(treeData.concat(childNodes));
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('网络错误');
      } else {
        message.error('遇到了未知错误')
      }
      console.error(e);
    })
  )


  async function assignClickHandler(values: {
    title: string,
    assignment: string,
    deadline: Moment,
    target: number[]
  }) {
    const deadline = values.deadline.format('YYYY-MM-DD HH:mm:ss');
    setConfirmLoading(true);
    let studentList = [] as number[]
    values.target.forEach(item => {
      if (isNaN(+item)) {
        const filtered = treeData.filter(node => node.key === item)[0];
        if (filtered && filtered.length !== 0) {
          const pid = filtered.id;
          const studentNodes = treeData.filter(node => node.pId === pid);
          const studentIdsOfClass = studentNodes.map(item => item.value);
          studentList = studentList.concat(studentIdsOfClass);
        }
      } else {
        studentList.push(item);
      }
    })

    fetch(`/api/homework/teacher/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
        assignment: values.assignment,
        deadline: deadline,
        target: studentList
      })
    }).then(res => {
      setConfirmLoading(false);
      return res.json() as Promise<JsonResponse>
    }).then(json => {
      if (json.code === 0) {
        message.success('作业已下发');
        form.resetFields();
        setModalOpen(false);
        mutateHomework();
      } else {
        message.error(`未知错误：${json.code}`);
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('网络错误');
      } else {
        message.error('遇到了未知错误')
      }
      console.error(e);
    }).finally(() => {
      setConfirmLoading(false);
    })
  }

  // FIXME: 展开项目无法折叠
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);

  function onTreeChange(checkedValues: string[]) {
    const expand = checkedValues.filter((value) => {
      return treeData.find(item => item.key === value)?.pId === 0
    })

    setTreeExpandedKeys(treeExpandedKeys.length === 0 ? expand : treeExpandedKeys.concat(expand));
  }

  function onTreeExpand(expand: Key[]) {
    setTreeExpandedKeys(treeExpandedKeys.length === 0 ? expand : treeExpandedKeys.concat(expand));
  }

  return (
    <HwLayout>
      <Spin spinning={!(user && homework)}>
        {homework && <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
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
        }
        <Modal
          open={modalOpen}
          title='作业布置'
          onCancel={() => { setModalOpen(false); }}
          width={'80vw'}
          style={{ minHeight: '80vh' }}
          confirmLoading={confirmLoading}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                assignClickHandler(values);
              })
              .catch(() => {
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
                treeDataSimpleMode
                treeData={treeData}
                treeCheckable
                loadData={onLoadData}
                treeExpandAction='click'
                onChange={onTreeChange}
                treeExpandedKeys={treeExpandedKeys}
                onTreeExpand={onTreeExpand}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </HwLayout>);
}
