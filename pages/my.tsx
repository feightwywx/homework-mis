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
import { Button, Col, Descriptions, Row, Space, Spin, Typography } from "antd";
import { CourseCard } from "../components/CourseCard";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

function MyIndexPage() {
  const { user } = useUser();

  const { data: userDetailData } = useSWR(`/api/user/${user?.userType}/detail`);
  const userDetail = (
    userDetailData as JsonResponse<StudentUserDetail | TeacherUserDetail>
  )?.result;

  return (
    <HwLayout>
      {userDetail ? (
        <>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Title>个人资料</Title>

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
              ) : <></>}
            </Descriptions>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning></Spin>
        </div>
      )}
    </HwLayout>
  );
}

export default MyIndexPage as NextPage;
