import { NextPage } from "next";
import HwLayout from "../components/layout";
import useUser from "../utils/hooks/useUser";
import useSWR from "swr";
import {
  Course,
  JsonResponse,
  StudentUserDetail,
  TeacherUserDetail,
} from "../utils/types";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { CourseCard } from "../components/CourseCard";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

type passwordFormData = {
  "old-password": string;
  "new-password": string;
  "repeat-password": string;
};

const { Text, Title } = Typography;

function MyIndexPage() {
  const { user } = useUser();
  const [messageApi, messageContext] = message.useMessage();

  const { data: userDetailData } = useSWR(`/api/user/${user?.userType}/detail`);
  const userDetail = (
    userDetailData as JsonResponse<StudentUserDetail | TeacherUserDetail>
  )?.result;

  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();

  const onPasswordFormFinish = async (values: passwordFormData) => {
    console.log(values);
    setModalConfirmLoading(true);

    try {
      if (!user) return;
      const validateResponse = await fetch(`/api/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.actual_id,
          password: values["old-password"],
          usertype: user.userType,
        }),
      });
      const validateResponseJson =
        (await validateResponse.json()) as JsonResponse;
      console.log(validateResponseJson);
      if (validateResponseJson.code !== 0) {
        message.error("旧密码错误");
        return;
      }

      const changePasswordResponse = await fetch(`/api/user/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: values["new-password"],
          usertype: user.userType,
        }),
      });
      const changePasswordResponseJson =
        (await changePasswordResponse.json()) as JsonResponse<number>;
      if (changePasswordResponseJson.code === 0) {
        message.success("修改成功");
        setPasswordModalOpen(false);
      } else {
        message.error("遇到了未知错误");
      }
    } catch (e) {
      if ((e as Error).message === "Failed to fetch") {
        messageApi.error("网络错误");
      } else {
        messageApi.error("遇到了未知错误");
      }
      console.error(e);
    } finally {
      setModalConfirmLoading(false);
    }
  };

  return (
    <HwLayout>
      {messageContext}
      {userDetail ? (
        <>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", paddingBottom: 32 }}
          >
            <Title>个人资料</Title>

            <div>
              <Title level={2}>个人信息</Title>
              <Descriptions>
                <Descriptions.Item label="用户名">
                  {userDetail.actualID}
                </Descriptions.Item>
                <Descriptions.Item label="姓名">
                  {userDetail.name}
                </Descriptions.Item>
                {(userDetail as StudentUserDetail).class ? (
                  <Descriptions.Item label="班级">
                    {(userDetail as StudentUserDetail).class}
                  </Descriptions.Item>
                ) : (
                  <></>
                )}
              </Descriptions>
            </div>

            <div>
              <Title level={2}>设置</Title>
              <div>
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  onClick={() => {
                    setPasswordModalOpen(true);
                  }}
                >
                  修改密码
                </Button>
                <Title level={3}>修改密码</Title>
                <Text>定期修改密码有利于保障账户安全。</Text>
              </div>
            </div>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning></Spin>
        </div>
      )}
      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
        }}
        onOk={() => {
          passwordForm.submit();
        }}
        confirmLoading={modalConfirmLoading}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onPasswordFormFinish}
        >
          <Form.Item
            name="old-password"
            label="旧密码"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="new-password"
            label="新密码"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="repeat-password"
            label="重复密码"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new-password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不相同"));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </HwLayout>
  );
}

export default MyIndexPage as NextPage;
