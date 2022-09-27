import { NextPage } from 'next';
import { useRouter } from 'next/router';
import HwLayout from '../../components/layout';
import { Typography, Space, Button, Divider, Tag, Modal, Input, Table, Form, InputNumber } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import { useMediaPredicate } from "react-media-hook";
import useUser from '../../utils/hooks/useUser';
import { HomeworkDetail, HomeworkDetailContent, HomeworkStudentDetail, HomeworkTeacherDetail, HomeworkTeacherDetailContent } from '../../utils/types';
import React, { useState } from 'react';
import useSWR from 'swr';
import parseMysqlDateTime from '../../utils/parseTime';
import { ColumnsType } from 'antd/lib/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function HomeworkDetailPage() {
  const router = useRouter();
  const { hwid } = router.query;

  const { user } = useUser();

  const { data } = useSWR(`/api/homework/${user?.userType}/detail/${hwid}`);

  const detail = (data as HomeworkStudentDetail)?.detail;
  const content = (data as HomeworkStudentDetail)?.content;
  const dead = detail ? new Date(Date.now()) > parseMysqlDateTime(detail.deadline) : false;

  return (
    <HwLayout>
      {data && hwid &&
        <>
          <CommonDetail content={detail} />
          {user?.userType === 'student'
            ? <StudentDetail content={content} dead={dead} hwid={+hwid} />
            : <TeacherDetail content={(data as HomeworkTeacherDetail).content} hwid={+hwid} />
          }

        </>
      }
    </HwLayout>
  )
}

export function CommonDetail({ content: detail }: { content: HomeworkDetail }) {
  const router = useRouter();

  return (<>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{
            float: 'left', verticalAlign: 'middle', margin: '8px 24px 0 0'
          }}
          onClick={() => { router.push('/') }}
        />
        <Title style={{ float: 'left' }}>{detail.title}</Title>
      </div>
      <Space direction='vertical' size='small'>
        <Text>发布时间：{parseMysqlDateTime(detail.time).toLocaleString()}</Text>
        <Text>截止时间：{parseMysqlDateTime(detail.deadline).toLocaleString()}</Text>
      </Space>
      <Divider />
      <Title level={2}>作业内容</Title>
      <Paragraph>
        {detail.assignment}
      </Paragraph>
      <Divider />
    </Space>
  </>)
}

export function StudentDetail({
  content, dead = false, hwid, teacher = false
}: {
  content: HomeworkDetailContent | HomeworkTeacherDetailContent,
  dead?: boolean,
  hwid: number,
  teacher?: boolean
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [accContent, setAccContent] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const router = useRouter()

  function accFieldHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAccContent(e.target.value);
  }

  function submitHandler() {
    setConfirmLoading(true);
    fetch(`/api/homework/student/update/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: accContent })
    }).then(() => {
      setConfirmLoading(false);
      setModalOpen(false);
      router.reload();
    }).catch(err => {
      console.error(err)
    })
  }

  const matches = useMediaPredicate("(min-width: 768px)")

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div>
          <Title level={2} style={{ float: 'left' }}>
            {!teacher ? '我的提交' : `${(content as HomeworkTeacherDetailContent).studentName}的提交内容`}
          </Title>
          {
            !teacher &&
            <Button
              type='primary'
              shape='round'
              icon={<FormOutlined />}
              style={{ float: 'right', marginTop: 8 }}
              disabled={content.completed || dead}
              onClick={() => { setModalOpen(true); }}
            >
              提交作业
            </Button>
          }

        </div>
        {(!content.completed && !content.accomplishment?.content && !dead)
          && <Paragraph>{!teacher ? '目前还没有提交过这项作业。点击右上角的按钮来提交吧。' : '该学生没有提交这项作业。'}</Paragraph>}
        {(!content.completed && !content.accomplishment?.content && dead)
          && <Paragraph>{!teacher ? '这项作业已经过期，无法提交！': '该学生没有提交这项作业。'}</Paragraph>}
        {content.accomplishment?.content
          && <div>
            <Title level={3} style={{ float: 'left', marginBottom: 0 }}>提交内容</Title>
            <Paragraph style={{ float: 'right', marginTop: 6 }}>
              {matches && '提交时间：'}{parseMysqlDateTime(content.accomplishment.time).toLocaleString()}
            </Paragraph>
          </div>}
        <Paragraph>
          {/* FIXME: 换行渲染不出来 */}
          {content.accomplishment?.content}
        </Paragraph>
        {content.accomplishment?.content &&
          <>
            <Divider />
            <Title level={2}>作业评价</Title>
            {content.judge ?
              <>
                <div>
                  <Title level={3} style={{ float: 'left' }}>得分</Title>
                  <Text style={{ float: 'right', fontSize: 18 }}>/100</Text>
                  <Text
                  style={{ float: 'right', fontSize: 18 }}
                  type={content.judge.score
                    ? 'success'
                  : (content.judge.comment
                  ? 'warning'
                  : 'danger')}>
                    {content.judge.score ?? (content.judge.comment && '已打回')}
                    </Text>
                </div>
                <Title level={3} style={{ float: 'left', marginBottom: 0 }}>评语</Title>
                <Paragraph>
                  {content.judge?.comment ?
                    content.judge.comment :
                    (!teacher ? '老师没有留下评语哦～' : '没有留下评语。')}
                </Paragraph>
              </> :
              <Paragraph>{!teacher ? '老师还没有批阅你的作业，请耐心等待。' : '还没有批阅这项作业。'}</Paragraph>}
          </>}
      </Space>
      <Modal
        open={modalOpen}
        title='作业提交'
        onCancel={() => { setModalOpen(false); }}
        width={'80vw'}
        cancelText='取消'
        okText='提交'
        confirmLoading={confirmLoading}
        onOk={submitHandler}
      >
        <Paragraph>请输入需要提交的内容。</Paragraph>
        <TextArea
          rows={20}
          onChange={accFieldHandler}
          onBlur={accFieldHandler}
          showCount
        />
      </Modal>
    </>)
}

export function TeacherDetail({ content, hwid }: { content: Array<HomeworkTeacherDetailContent>, hwid: number }) {
  interface DataType {
    key: number;
    name: string;
    status: string[];
    time: string;
  }

  const TagColor = {
    '已完成': 'green',
    '待评分': 'magenta',
    '已评分': 'lime'
  } as { [x: string]: string }

  const router = useRouter();

  const [judgeModalOpen, setJudgeModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState({} as HomeworkTeacherDetailContent)
  const [confirmJudgeLoading, setConfirmJudgeLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState(0);

  const [form] = Form.useForm();

  const judgeClickHandler = (values: {
    score: number, comment?: string
  }) => {
    setConfirmJudgeLoading(true);

    fetch(`/api/homework/teacher/judge/${currentContentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: values.score, comment: values.comment })
    }).then(() => {
      router.reload();
      setConfirmJudgeLoading(false);
      setJudgeModalOpen(false);
      setDetailModalOpen(false);
    }).catch(err => {
      console.error(err)
    })
  };

  function rejectClickHandler() {
    fetch(`/api/homework/teacher/reject/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(() => {
      router.reload();
    }).catch(err => {
      console.error(err);
    })
  }

  return (<>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Title level={2}>已提交</Title>
      <Table
        dataSource={content.map((item) => {
          let status = [];
          if (item.completed) {
            status.push('已完成')

            if (!item.judge || (item.judge.score === null)) {
              status.push('待评分')
            } else {
              status.push('已评分')
            }
          }

          if (!item.completed) {
            if (item.accomplishment?.content) {
              status.push('已打回')
            } else {
              status.push('未完成')
            }
          }

          return {
            key: item.contentId,
            name: item.studentName,
            status: status,
            time: item.accomplishment?.time ? parseMysqlDateTime(item.accomplishment?.time).toLocaleString() : ''
          }
        })}
        columns={[
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
              <>
                {status.map(tag => {
                  return (
                    <Tag color={TagColor[tag] ?? 'grey'} key={tag}>
                      {tag}
                    </Tag>
                  );
                })}
              </>
            )
          },
          {
            title: '提交时间',
            dataIndex: 'time',
            key: 'time'
          },
          {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Space size='small'>
                <Button
                  type='link'
                  onClick={() => {
                    const promise = new Promise<HomeworkTeacherDetailContent>((resolve, reject) => {
                      const curr = content.filter((item) => (item.contentId === record.key))[0]
                      if (curr) {
                        resolve(curr);
                      } else {
                        reject();
                      }

                    })
                    promise.then((data: HomeworkTeacherDetailContent) => {
                      setCurrentContentId(data.contentId)
                      setCurrentDetail(data as HomeworkTeacherDetailContent);
                      setDetailModalOpen(true);
                    })
                  }}>
                  查看
                </Button>
                <Button
                  type='link'
                  disabled={record.status.includes('未完成') || record.status.includes('已打回')}
                  onClick={() => { setJudgeModalOpen(true); setCurrentContentId(record.key); }}>
                  批阅
                </Button>
                <Button
                  type='link'
                  disabled={record.status.includes('未完成') || record.status.includes('已打回')}
                  onClick={rejectClickHandler}>
                  打回
                </Button>
              </Space>
            )
          }] as ColumnsType<DataType>} />
    </Space>
    <Modal
      open={judgeModalOpen}
      title='作业批阅'
      onCancel={() => { setJudgeModalOpen(false); }}
      width={'80vw'}
      confirmLoading={confirmJudgeLoading}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            judgeClickHandler(values);
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
          label='得分 　　　　'
          name='score'
          rules={[{
            required: true,
            message: '请输入得分！'
          },
          {
            type: 'number',
            min: 0,
            max: 100,
            message: '得分需要在0～100之间！'
          }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label='评语'
          name='comment'>
          <TextArea
            rows={10}
            showCount
          />
        </Form.Item>

      </Form>
    </Modal>
    <Modal
      open={detailModalOpen}
      title='作业详情'
      onCancel={() => { setDetailModalOpen(false); setJudgeModalOpen(false); }}
      width={'80vw'}
      onOk={() => {
        setJudgeModalOpen(true);
      }}
      okText='批阅'
      okButtonProps={{
        disabled: !currentDetail.completed
      }}
    >
      <StudentDetail content={currentDetail} hwid={1} teacher={true} />
    </Modal>
  </>)
}

export default HomeworkDetailPage as NextPage;
