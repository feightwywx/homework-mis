import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import React from 'react';
import styles from '../styles/Layout.module.css';
import useUser from '../utils/useUser';
import fetchJson from '../utils/fetchJson';

const { Header, Content, Footer } = Layout

export default function HwLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const { user, mutateUser } = useUser()

  async function onLogoutClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    mutateUser(
      await fetchJson('/api/user/logout', {method: 'POST'})
    )
  }

  return (
    <Layout>
      <Header>
        <div className={styles.logo}>学生作业管理系统</div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={
            [
              {
                key: 'home',
                label: (
                  <a href="/">
                    首页
                  </a>
                )
              }
            ]
          }
          style={{ float: 'left' }}>
        </Menu>
        {user?.isLoggedIn ?
          <div className={styles.user}>
            <Avatar icon={<UserOutlined />} />
            <Dropdown overlay={
              <Menu items={[
                {
                  key: 'logout',
                  label: <div onClick={onLogoutClick}>注销</div>
                }
              ]}
                style={{ marginTop: 12, padding: 12 }}
              />
            }

              trigger={['click']}>
              <a onClick={e => e.preventDefault()} style={{
                color: '#fff',
                marginLeft: 12
              }}>
                <Space>
                  {user.name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          : null}

      </Header>
      <Content className={styles.layout_content} >
        <div className={styles['site-layout-content']}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ©️2022 .direwolf
      </Footer>
    </Layout>
  )
}
