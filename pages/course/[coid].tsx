import { NextPage } from "next";
import HwLayout from "../../components/layout";
import useUser from "../../utils/hooks/useUser";
import useSWR from "swr";
import {
  Course,
  Exam,
  Homework,
  HomeworkDetail,
  HomeworkStudentDetail,
  JsonResponse,
  StudentHomework,
} from "../../utils/types";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { CourseCard } from "../../components/CourseCard";
import {
  ArrowLeftOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { HomeworkCard } from "../../components/HomeworkCard";
import { ExamCard } from "../../components/ExamCard";
import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { RangePickerProps } from "antd/lib/date-picker";
import parseMysqlDateTime from "../../utils/parseTime";

const { Text, Title } = Typography;

const CourseIndexPage: NextPage = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { user } = useUser();

  const { data: homeworkData } = useSWR(
    `/api/course/${user?.userType}/homework/${coid}`
  );
  const homeworks = (
    homeworkData as JsonResponse<Homework[] | StudentHomework[]>
  )?.result;

  const { data: courseData } = useSWR(
    `/api/course/${user?.userType}/info/${coid}`
  );
  const course = (courseData as JsonResponse<Course>)?.result;

  const { data: examData } = useSWR(`/api/exam/course/${coid}`);
  const exams = (examData as JsonResponse<Exam[]>)?.result;

  return (
    <HwLayout>
      {homeworks && exams && course ? (
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
              <Title style={{ float: "left" }}>{course.name}</Title>
            </div>
            <Card style={{ marginBottom: 12 }}>
              <Avatar icon={<UserOutlined />} style={{ marginTop: 0 }} />
              <Text style={{ marginLeft: 12 }}>{course.teacherName}</Text>
            </Card>

            <div style={{ display: "flow" }}>
              {user?.userType === "teacher" && <AssignHomeworkButton />}
              <Title level={2}>作业</Title>
            </div>

            <Row gutter={16}>
              {homeworks
                .sort(
                  (a, b) =>
                    parseMysqlDateTime(b.time).getTime() -
                    parseMysqlDateTime(a.time).getTime()
                )
                .map((item, index) => (
                  <Col xs={24} md={12} xl={8} key={index}>
                    <HomeworkCard homework={item} />
                  </Col>
                ))}
            </Row>

            <Title level={2}>考试</Title>
            <Row gutter={16}>
              {exams
                .sort(
                  (a, b) =>
                    parseMysqlDateTime(b.time).getTime() -
                    parseMysqlDateTime(a.time).getTime()
                )
                .map((item, index) => (
                  <Col xs={24} md={12} xl={8} key={index}>
                    <ExamCard exam={item} />
                  </Col>
                ))}
            </Row>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning></Spin>
        </div>
      )}
    </HwLayout>
  );
};

const AssignHomeworkButton: React.FC = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { user } = useUser();

  const { mutate: mutateHomework } = useSWR(
    `/api/course/${user?.userType}/homework/${coid}`
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, messageContext] = message.useMessage();

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  async function assignClickHandler(values: {
    title: string;
    assignment: string;
    deadline: Dayjs;
  }) {
    const deadline = values.deadline.format("YYYY-MM-DD HH:mm:ss");
    setConfirmLoading(true);

    fetch(`/api/homework/teacher/assign_v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        assignment: values.assignment,
        deadline: deadline,
        courseID: coid,
      }),
    })
      .then((res) => {
        setConfirmLoading(false);
        return res.json() as Promise<JsonResponse>;
      })
      .then((json) => {
        if (json.code === 0) {
          messageApi.success("作业已下发");
          form.resetFields();
          setModalOpen(false);
          mutateHomework();
        } else {
          messageApi.error(`未知错误：${json.code}`);
        }
      })
      .catch((e) => {
        if ((e as Error).message === "Failed to fetch") {
          messageApi.error("网络错误");
        } else {
          messageApi.error("遇到了未知错误");
        }
        console.error(e);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  }

  return (
    <>
      {messageContext}
      <Button
        type="primary"
        shape="round"
        icon={<FormOutlined />}
        style={{ float: "right" }}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        下发作业
      </Button>
      <Modal
        open={modalOpen}
        title="作业布置"
        onCancel={() => {
          setModalOpen(false);
        }}
        width={"80vw"}
        style={{ minHeight: "80vh" }}
        confirmLoading={confirmLoading}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          autoComplete="off"
          requiredMark="optional"
          onFinish={assignClickHandler}
        >
          <Form.Item
            label="作业标题"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="作业描述"
            name="assignment"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={10} showCount />
          </Form.Item>
          <Form.Item
            label="截止日期"
            name="deadline"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CourseIndexPage;
