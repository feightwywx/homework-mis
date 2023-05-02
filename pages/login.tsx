import { NextPage } from 'next';
import React from 'react';
import HwLayout from '../components/layout';
import { Typography, Form, Input, Button, Radio, message, Spin } from 'antd';
import useUser from '../utils/hooks/useUser';
import { JsonResponse, User } from '../utils/types';

const { Title } = Typography

function Login() {
  const { mutateUser } = useUser()
  const [spinning, setSpinning] = React.useState(false)

  async function onFinish(values: any) {
    setSpinning(true);
    fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    }).then(res => {
      return res.json() as Promise<JsonResponse<User>>
    }).then(json => {
      if (json.code === 0) {
        mutateUser(json);
      } else if (json.code === 200) {
        message.error('用户名或密码错误');
      } else {
        message.error(`未知错误：${json.code}`);
      }
    }).catch(e => {
      if ((e as Error).message === 'Failed to fetch') {
        message.error('网络错误');
      } else {
        message.error('遇到了未知错误')
      }
    }).finally(() => {
      setSpinning(false);
    })
  }

  return (
    <HwLayout>
      <Spin spinning={spinning}>
        <div style={{
          textAlign: 'center', maxWidth: '40vh', margin: 'auto'
        }}>
          <Title>登录</Title>
          <Form
            name='login'
            autoComplete='on'
            style={{ marginTop: 32, alignContent: 'left' }}
            initialValues={{
              usertype: 'student'
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name='usertype'
            >
              <Radio.Group options={[
                { label: '学生账号', value: 'student' },
                { label: '教师账号', value: 'teacher' }
              ]} optionType="button" />
            </Form.Item>
            <Form.Item
              label='用户名'
              name='username'
              rules={[
                { required: true, message: '请输入用户名！' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='密　码'
              name='password'
              rules={[
                { required: true, message: '请输入密码！' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </HwLayout>
  )
}

export default Login as NextPage