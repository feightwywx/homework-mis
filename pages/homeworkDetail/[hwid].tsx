import { NextPage } from 'next';
import { useRouter } from 'next/router';
import HwLayout from '../../components/layout';
import { Typography, Space, Button, Divider, Tag, Modal, Input, Table, Form, InputNumber } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useMediaPredicate } from "react-media-hook";
import useUser from '../../utils/hooks/useUser';
import { HomeworkDetail, HomeworkDetailContent, HomeworkStudentDetail, HomeworkTeacherDetail, HomeworkTeacherDetailContent } from '../../utils/types';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import parseMysqlDateTime from '../../utils/parseTime';
import { ColumnsType } from 'antd/lib/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function HomeworkDetail() {
  const router = useRouter();
  const { hwid } = router.query;

  const { user } = useUser();

  const { data, error } = useSWR(`/api/homework/${user?.userType}/detail/${hwid}`);

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

export function StudentDetail({ content, dead = false, hwid }: { content: HomeworkDetailContent, dead: boolean, hwid: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [accContent, setAccContent] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false)
  const router = useRouter();

  function accFieldHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAccContent(e.target.value);
  }

  function submitHandler() {
    setConfirmLoading(true);
    fetch(`/api/homework/student/update/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: accContent })
    }).then(res => {
      console.log(res);
      setConfirmLoading(false);
      setModalOpen(false);
    }).catch(err => {
      console.error(err)
    })
  }

  const matches = useMediaPredicate("(min-width: 768px)")

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div>
          <Title level={2} style={{ float: 'left' }}>我的提交</Title>
          <Button
            type='primary'
            shape='round'
            icon={<FormOutlined />}
            style={{ float: 'right', marginTop: 8 }}
            disabled={content.completed || dead}
            onClick={() => { setModalOpen(true); }}
          >提交作业</Button>
        </div>
        {(!content.completed && !content.accomplishment?.content && !dead)
          && <Paragraph>目前还没有提交过这项作业。点击右上角的按钮来提交吧。</Paragraph>}
        {(!content.completed && !content.accomplishment?.content && dead)
          && <Paragraph>这项作业已经过期，无法提交！</Paragraph>}
        {content.accomplishment?.content
          && <div>
            <Title level={3} style={{ float: 'left', marginBottom: 0 }}>提交内容</Title>
            <Paragraph style={{ float: 'right', marginTop: 6 }}>{matches && '提交时间：'}{parseMysqlDateTime(content.accomplishment.time).toLocaleString()}</Paragraph>
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
                  <Text style={{ float: 'right', fontSize: 18 }} type='success'>{content.judge.score}</Text>
                </div>
                <Title level={3} style={{ float: 'left', marginBottom: 0 }}>评语</Title>
                <Paragraph>
                  {content.judge?.comment ?
                    content.judge.comment :
                    '老师没有留下评语哦～'}
                </Paragraph>
              </> :
              <Paragraph>老师还没有批阅你的作业，请耐心等待。</Paragraph>}
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

  const [judgeModalOpen, setJudgeModalOpen] = useState(false);
  const [confirmJudgeLoading, setConfirmJudgeLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState(0);

  const [form] = Form.useForm();

  const onCreate = (values: {
    score: number, comment?: string
  }) => {
    setConfirmJudgeLoading(true);

    fetch(`/api/homework/teacher/judge/${currentContent}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: values.score, comment: values.comment })
    }).then(res => {
      console.log(res);
      setConfirmJudgeLoading(false);
      setJudgeModalOpen(false);
    }).catch(err => {
      console.error(err)
    })
  };

  function rejectClickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    fetch(`/api/homework/teacher/reject/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    })
  }

  return (<>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Title level={2}>已提交</Title>
      <Table
        dataSource={content.map((item, index) => {
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
                {/* TODO: 查看Modal框，可链接到详情 */}
                <Button
                  type='link'
                  disabled={record.status.includes('未完成') || record.status.includes('已打回')}
                  onClick={() => { setJudgeModalOpen(true); setCurrentContent(record.key); }}>
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
      title='作业提交'
      onCancel={() => { setJudgeModalOpen(false); }}
      width={'80vw'}
      confirmLoading={confirmJudgeLoading}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
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
  </>)
}

export default HomeworkDetail as NextPage;
