import { NextPage } from 'next';
import React from 'react';
import HwLayout from '../components/layout';
import { Typography, Form, Input, Button, Radio, message } from 'antd';
import useUser from '../utils/hooks/useUser';
import { JsonResponse, User } from '../utils/types';

const { Title } = Typography

function Login() {
  const { mutateUser } = useUser()

  async function onFinish(values: any) {
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
      message.error(e.toString());
      console.error(e);
    })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('验证失败', errorInfo);
  };

  return (
    <HwLayout>
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
          onFinishFailed={onFinishFailed}
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
    </HwLayout>
  )
}

export default Login as NextPage