import { NextPage } from "next";
import HwLayout from "../../components/layout";
import useUser from "../../utils/hooks/useUser";
import useSWR from "swr";
import { Course, JsonResponse } from "../../utils/types";
import { Button, Col, Row, Space, Spin, Typography } from "antd";
import { CourseCard } from "../../components/CourseCard";
import { PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

function CourseIndexPage() {
  const { user } = useUser();

  const { data } = useSWR(`/api/course/${user?.userType}/my`);
  const courses = (data as JsonResponse<Course[]>)?.result;

  return (
    <HwLayout>
      {courses ? (
        <>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div>
            <Button
            type='primary'
            shape='round'
            icon={<PlusOutlined />}
            style={{ float: 'right' }}
            onClick={() => {}}>新建课程</Button>
              <Title>我的课程</Title>
            </div>
            
            <Row gutter={16}>
              {courses.map((item, index) => (
                <Col xs={24} md={12} xl={8} key={index}>
                  <CourseCard course={item} />
                </Col>
              ))}
            </Row>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning={!courses}></Spin>
        </div>
      )}
    </HwLayout>
  );
}

export default CourseIndexPage as NextPage;
