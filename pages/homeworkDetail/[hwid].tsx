import { NextPage } from 'next';
import { useRouter } from 'next/router';
import HwLayout from '../../components/layout';
import { Typography, Space, Button, Divider, Tag, Modal, Input, InputRef } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useUser from '../../utils/hooks/useUser';
import { HomeworkDetail, HomeworkDetailContent, HomeworkStudentDetail } from '../../utils/types';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import parseMysqlDateTime from '../../utils/parseTime';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function HomeworkDetailRoute() {
  const router = useRouter();
  const { hwid } = router.query;

  const { data, error } = useSWR(`/api/homework/student/detail/${hwid}`);

  const detail = (data as HomeworkStudentDetail)?.detail;
  const content = (data as HomeworkStudentDetail)?.content;
  const dead = detail ? new Date(Date.now()) > parseMysqlDateTime(detail.deadline) : false;

  return (
    <HwLayout>
      {data && hwid &&
        <>
          <CommonDetail content={detail} />
          <StudentDetail content={content} dead={dead} hwid={+hwid} />
        </>
      }
    </HwLayout>
  )
}

export function CommonDetail({ content: detail }: { content: HomeworkDetail }) {
  return (<>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{
            float: 'left', verticalAlign: 'middle', margin: '8px 24px 0 0'
          }}
          href='/'
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

  function accFieldHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAccContent(e.target.value);
  }

  function submitHandler() {
    setConfirmLoading(true);
    fetch(`/api/homework/student/update/${hwid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({content: accContent})
    }).then(res => {
      console.log(res);
      setConfirmLoading(false);
      setModalOpen(false);
    }).catch(err => {
      console.error(err)
    })
  }

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
            <Paragraph style={{ float: 'right', marginTop: 6 }}>提交时间：{parseMysqlDateTime(content.accomplishment.time).toLocaleString()}</Paragraph>
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

export default HomeworkDetailRoute as NextPage;
