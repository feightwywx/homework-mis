import { NextPage } from "next";
import HwLayout from "../../components/layout";
import useUser from "../../utils/hooks/useUser";
import useSWR from "swr";
import { Course, Homework, HomeworkDetail, HomeworkStudentDetail, JsonResponse, StudentHomework } from "../../utils/types";
import { Button, Col, Row, Space, Spin, Typography } from "antd";
import { CourseCard } from "../../components/CourseCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { HomeworkCard } from "../../components/HomeworkCard";

const { Text, Title } = Typography;

const CourseIndexPage: NextPage = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { user } = useUser();

  const { data: homeworkData } = useSWR(`/api/course/${user?.userType}/homework/${coid}`);
  const homeworks = (homeworkData as JsonResponse<Homework[] | StudentHomework[]>)?.result;

  return (
    <HwLayout>
      
      {homeworks ? (
        <>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  float: "left",
                  verticalAlign: "middle",
                  margin: "8px 24px 0 0",
                }}
                onClick={() => {
                  router.back();
                }}
              />
              <Title style={{ float: "left" }}>课程名称</Title>
            </div>
            
            <Title level={2}>作业</Title>
            <Row gutter={16}>
              {homeworks.map((item, index) => (
                <Col xs={24} md={12} xl={8} key={index}>
                  <HomeworkCard homework={item} />
                </Col>
              ))}
            </Row>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning={!homeworks}></Spin>
        </div>
      )}
    </HwLayout>
  );
};

export default CourseIndexPage;
