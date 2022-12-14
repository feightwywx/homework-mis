import { NextPage } from 'next';
import { useRouter } from 'next/router';
import HwLayout from '../../components/layout';
import { Typography, Space, Button, Divider, Tag, Modal, Input, Table, Form, InputNumber, message, Spin } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import { useMediaPredicate } from "react-media-hook";
import useUser from '../../utils/hooks/useUser';
import { HomeworkDetail, HomeworkDetailContent, HomeworkStudentDetail, HomeworkTeacherDetail, HomeworkTeacherDetailContent, JsonResponse } from '../../utils/types';
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

  const detail = (data as JsonResponse<HomeworkStudentDetail>)?.result?.detail;
  const content = (data as JsonResponse<HomeworkStudentDetail>)?.result?.content;
  const dead = detail ? new Date(Date.now()) > parseMysqlDateTime(detail.deadline) : false;

  return (
    <HwLayout>
      {(data && hwid && detail && content) ?
        <>
          <CommonDetail content={detail} />
          {user?.userType === 'student'
            ? <StudentDetail content={content} dead={dead} hwid={+hwid} />
            : <TeacherDetail content={(data as JsonResponse<HomeworkTeacherDetail>).result.content} hwid={+hwid} />
          }

        </>
        : <div style={{ margin: '32px', textAlign: 'center' }}>
          <Spin spinning={!(data && hwid && detail && content)}>
          </Spin>
        </div>
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
        <Text>???????????????{parseMysqlDateTime(detail.time).toLocaleString()}</Text>
        <Text>???????????????{parseMysqlDateTime(detail.deadline).toLocaleString()}</Text>
      </Space>
      <Divider />
      <Title level={2}>????????????</Title>
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

  const { mutate } = useSWR(`/api/homework/student/detail/${hwid}`);

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
      setConfirmLoading(false);
      return res.json() as Promise<JsonResponse>
    }).then(json => {
      if (json.code === 0) {
        mutate();
        setModalOpen(false);
        message.success('?????????');
      } else {
        message.error(`???????????????${json.code}`);
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('????????????');
      } else {
        message.error('?????????????????????')
      }
      console.error(e);
    }).finally(() => {
      setConfirmLoading(false);
    })
  }

  const matches = useMediaPredicate("(min-width: 768px)")

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div>
          <Title level={2} style={{ float: 'left' }}>
            {!teacher ? '????????????' : `${(content as HomeworkTeacherDetailContent).studentName}???????????????`}
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
              ????????????
            </Button>
          }

        </div>
        {(!content.completed && !content.accomplishment?.content && !dead)
          && <Paragraph>{!teacher ? '??????????????????????????????????????????????????????????????????????????????' : '????????????????????????????????????'}</Paragraph>}
        {(!content.completed && !content.accomplishment?.content && dead)
          && <Paragraph>{!teacher ? '??????????????????????????????????????????' : '????????????????????????????????????'}</Paragraph>}
        {content.accomplishment?.content
          && <div>
            <Title level={3} style={{ float: 'left', marginBottom: 0 }}>????????????</Title>
            <Paragraph style={{ float: 'right', marginTop: 6 }}>
              {matches && '???????????????'}{parseMysqlDateTime(content.accomplishment.time).toLocaleString()}
            </Paragraph>
          </div>}
        <Paragraph>
          {/* FIXME: ????????????????????? */}
          {content.accomplishment?.content}
        </Paragraph>
        {content.accomplishment?.content &&
          <>
            <Divider />
            <Title level={2}>????????????</Title>
            {content.judge ?
              <>
                <div>
                  <Title level={3} style={{ float: 'left' }}>??????</Title>
                  <Text style={{ float: 'right', fontSize: 18 }}>/100</Text>
                  <Text
                    style={{ float: 'right', fontSize: 18 }}
                    type={content.judge.score
                      ? 'success'
                      : (content.judge.comment
                        ? 'warning'
                        : 'danger')}>
                    {content.judge.score ?? (content.judge.comment && '?????????')}
                  </Text>
                </div>
                <Title level={3} style={{ float: 'left', marginBottom: 0 }}>??????</Title>
                <Paragraph>
                  {content.judge?.comment ?
                    content.judge.comment :
                    (!teacher ? '??????????????????????????????' : '?????????????????????')}
                </Paragraph>
              </> :
              <Paragraph>{!teacher ? '??????????????????????????????????????????????????????' : '??????????????????????????????'}</Paragraph>}
          </>}
      </Space>
      <Modal
        open={modalOpen}
        title='????????????'
        onCancel={() => { setModalOpen(false); }}
        width={'80vw'}
        cancelText='??????'
        okText='??????'
        confirmLoading={confirmLoading}
        onOk={submitHandler}
      >
        <Paragraph>?????????????????????????????????</Paragraph>
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
    '?????????': 'green',
    '?????????': 'magenta',
    '?????????': 'lime'
  } as { [x: string]: string }

  const [judgeModalOpen, setJudgeModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState({} as HomeworkTeacherDetailContent)
  const [confirmJudgeLoading, setConfirmJudgeLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState(0);

  const [form] = Form.useForm();

  const { mutate } = useSWR(`/api/homework/teacher/detail/${hwid}`);

  const judgeClickHandler = (values: {
    score: number, comment?: string
  }) => {
    setConfirmJudgeLoading(true);

    fetch(`/api/homework/teacher/judge/${currentContentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: values.score, comment: values.comment })
    }).then(res => {
      setConfirmJudgeLoading(false);
      return res.json() as Promise<JsonResponse<number>>
    }).then(json => {
      if (json.code === 0) {
        message.success('?????????');
        mutate();
        form.resetFields();
        setJudgeModalOpen(false);
        setDetailModalOpen(false);
      } else {
        message.error(`???????????????${json.code}`);
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('????????????');
      } else {
        message.error('?????????????????????')
      }
      console.error(e);
    }).finally(() => {
      setConfirmJudgeLoading(false);
    })
  };

  function rejectClickHandler(studentName: string) {
    fetch(`/api/homework/teacher/reject/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName
      })
    }).then(res => {
      return res.json() as Promise<JsonResponse<number>>
    }).then(json => {
      if (json.code === 0) {
        message.success('?????????');
        mutate();
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('????????????');
      } else {
        message.error('?????????????????????')
      }
      console.error(e);
    })
  }

  return (<>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Title level={2}>?????????</Title>
      <Table
        dataSource={content.map((item) => {
          let status = [];
          if (item.completed) {
            status.push('?????????')

            if (!item.judge || (item.judge.score === null)) {
              status.push('?????????')
            } else {
              status.push('?????????')
            }
          }

          if (!item.completed) {
            if (item.accomplishment?.content) {
              status.push('?????????')
            } else {
              status.push('?????????')
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
            title: '??????',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '??????',
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
            title: '????????????',
            dataIndex: 'time',
            key: 'time'
          },
          {
            title: '??????',
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
                  ??????
                </Button>
                <Button
                  type='link'
                  disabled={record.status.includes('?????????') || record.status.includes('?????????')}
                  onClick={() => { setJudgeModalOpen(true); setCurrentContentId(record.key); }}>
                  ??????
                </Button>
                <Button
                  type='link'
                  disabled={record.status.includes('?????????') || record.status.includes('?????????')}
                  onClick={() => {
                    rejectClickHandler(record.name);
                  }}>
                  ??????
                </Button>
              </Space>
            )
          }] as ColumnsType<DataType>} />
    </Space>
    <Modal
      open={judgeModalOpen}
      title='????????????'
      onCancel={() => { setJudgeModalOpen(false); }}
      width={'80vw'}
      confirmLoading={confirmJudgeLoading}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
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
          label='?????? ????????????'
          name='score'
          rules={[{
            required: true,
            message: '??????????????????'
          },
          {
            type: 'number',
            min: 0,
            max: 100,
            message: '???????????????0???100?????????'
          }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label='??????'
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
      title='????????????'
      onCancel={() => { setDetailModalOpen(false); setJudgeModalOpen(false); }}
      width={'80vw'}
      onOk={() => {
        setJudgeModalOpen(true);
      }}
      okText='??????'
      okButtonProps={{
        disabled: !currentDetail.completed
      }}
    >
      <StudentDetail content={currentDetail} hwid={1} teacher={true} />
    </Modal>
  </>)
}

export default HomeworkDetailPage as NextPage;
