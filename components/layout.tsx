import { Avatar, Dropdown, Layout, Menu, Space, Spin } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useMediaPredicate } from "react-media-hook";

import React from "react";
import styles from "../styles/Layout.module.css";
import useUser from "../utils/hooks/useUser";
import fetchJson from "../utils/fetchJson";
import Link from "next/link";
import Router, { useRouter } from "next/router";

const { Header, Content, Footer } = Layout;

export default function HwLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const [spinning, setSpinning] = React.useState(false);

  async function onLogoutClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSpinning(true);
    mutateUser(await fetchJson("/api/user/logout", { method: "POST" }));
  }

  const matches = useMediaPredicate("(min-width: 768px)");

  Router.events.on("routeChangeStart", () => {
    setSpinning(true);
  });
  Router.events.on("routeChangeComplete", () => {
    setSpinning(false);
  });
  Router.events.on("routeChangeError", () => {
    setSpinning(false);
  });

  return (
    <Layout>
      <Header>
        <div className={styles.logo}>高校教学管理系统</div>
        {matches && (
          <Menu
            theme="dark"
            mode="horizontal"
            items={[
              {
                key: "home",
                label: <Link href="/">首页</Link>,
              },
              {
                key: "course",
                label: "课程",
                children: [
                  {
                    key: "course.my",
                    label: <Link href="/course">我的课程</Link>,
                  },
                  {
                    key: "course.join",
                    label: <Link href="/course/select">所有课程</Link>,
                  },
                ],
              },
              {
                key: "homework",
                label: "作业",
              },
            ]}
            style={{ float: "left" }}
          ></Menu>
        )}

        {user?.isLoggedIn ? (
          <div className={styles.user}>
            <Avatar icon={<UserOutlined />} />
            <Dropdown
              menu={{items: [
                    {
                      key: "my",
                      label: <Link href='/my'>个人资料</Link>,
                    },
                    {
                      key: "logout",
                      label: <div onClick={onLogoutClick}>注销</div>,
                    },
                  ]
              }}
              trigger={["click"]}
            >
              <a
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "#fff",
                  marginLeft: 12,
                }}
              >
                <Space>
                  {matches && user.name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : null}
      </Header>
      <Content className={styles.layout_content}>
        <Spin spinning={user === undefined || spinning} delay={500}>
          <div className={styles["site-layout-content"]}>{children}</div>
        </Spin>
      </Content>
      <Footer style={{ textAlign: "center" }}>©️2022 .direwolf</Footer>
    </Layout>
  );
}
