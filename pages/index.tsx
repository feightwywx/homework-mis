import { Avatar, Card, Col, Divider, Row, Space, Typography } from 'antd';

import Head from 'next/head'
import HwLayout from '../components/layout'
import Image from 'next/image'
import type { NextPage } from 'next'
import { UserOutlined } from '@ant-design/icons';
import styles from '../styles/Home.module.css'
import useUser from '../utils/useUser';

const { Title, Paragraph, Text } = Typography

const Home: NextPage = () => {
  const { user } = useUser()
  return (
    <HwLayout>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Title style={{ marginBottom: '16px' }}>早上好，{user?.name}同学</Title>
        <Title level={4} style={{ marginTop: 0 }}>目前有5项作业需要完成，现在还不能休息哦～</Title>
        <Divider />
        <Title level={5}>待完成作业</Title>
        <Row gutter={16}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Col span={8} key={index}>
              <Card title="作业标题" extra={<a href="">查看</a>} style={{ marginBottom: 16 }}>
                <Text>发布时间：2022年9月20日 11:45</Text><br />
                <Text>截止时间：2022年9月20日 11:45</Text>
                <Divider style={{ margin: '16px 0px' }} />
                <div >
                  <Avatar size={'small'} icon={<UserOutlined />} style={{marginTop: -4}} />
                  <Text style={{ marginLeft: 12 }}><b>羊驼</b>布置的作业</Text>
                </div>

              </Card>
            </Col>
          ))}
        </Row>
        <Title level={5}>已完成作业</Title>
        <Text>暂时还没有已完成作业～</Text>
      </Space>
    </HwLayout>
  )
}

export default Home
