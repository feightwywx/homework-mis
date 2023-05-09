import { NextPage } from "next";
import HwLayout from "../../../components/layout";
import useUser from "../../../utils/hooks/useUser";
import useSWR from "swr";
import {
  ExamContentScore,
  ExamTotalScore,
  HomeworkContentScore,
  HomeworkTotalScore,
  JsonResponse,
} from "../../../utils/types";
import { Button, Skeleton, Space, Spin, Table, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

const { Text, Title } = Typography;

const CourseGradePage: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <HwLayout>
      {user ? (
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
              <Title style={{ float: "left" }}>成绩</Title>
            </div>
            {user.userType === "student" && <StudentGradeReports />}
            {user.userType === "teacher" && <TeacherGradeReports />}
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

const StudentGradeReports: React.FC = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { data: homeworkScoresData } = useSWR<
    JsonResponse<HomeworkContentScore[]>
  >(`/api/homework/grade/${coid}`);
  const homeworkScoresDataSource = homeworkScoresData?.result.map((item) => ({
    key: item.id,
    ...item,
  }));

  const { data: examScoresData } = useSWR<JsonResponse<ExamContentScore[]>>(
    `/api/exam/grade/${coid}`
  );
  const examScoresDataSource = examScoresData?.result.map((item) => ({
    key: item.id,
    ...item,
  }));

  return (
    <>
      <Title level={2}>作业</Title>
      {homeworkScoresData && homeworkScoresData.code === 0 ? (
        <>
          <Space direction="horizontal">
            <Text>
              完成率：
              {(
                (homeworkScoresData.result.filter((item) => item.completed)
                  .length /
                  homeworkScoresData.result.length) *
                100
              ).toFixed(2)}
              %
            </Text>
            <Text>
              平均分：
              {(
                homeworkScoresData.result
                  .map((item) => item.score ?? 0)
                  .reduce((a, b) => a + b) / homeworkScoresData.result.length
              ).toFixed(2)}
            </Text>
          </Space>
          <Table
            columns={[
              {
                key: "homeworkTitle",
                dataIndex: "homeworkTitle",
                title: "作业",
              },
              {
                key: "completed",
                dataIndex: "completed",
                title: "完成状态",
                render: (_, record) =>
                  record.completed ? (
                    <Tag color="green">已完成</Tag>
                  ) : (
                    <Tag>未完成</Tag>
                  ),
                filters: [
                  { text: "已完成", value: true },
                  { text: "未完成", value: false },
                ],
                onFilter: (value, record) => record.completed === value,
              },
              {
                key: "score",
                dataIndex: "score",
                title: "评分",
                sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0),
              },
              {
                key: "action",
                title: "操作",
                render: (_, record) => (
                  <Button
                    type="link"
                    onClick={() => {
                      router.push(`/homeworkDetail/${record.homeworkID}`);
                    }}
                  >
                    查看作业
                  </Button>
                ),
              },
            ]}
            dataSource={homeworkScoresDataSource}
          />
        </>
      ) : (
        <Skeleton active />
      )}

      <Title level={2}>考试</Title>
      {examScoresData && examScoresData.code === 0 ? (
        <>
          <Space direction="horizontal">
            <Text>
              平均分：
              {(
                examScoresData.result
                  .map((item) => item.score ?? 0)
                  .reduce((a, b) => a + b) / examScoresData.result.length
              ).toFixed(2)}
            </Text>
          </Space>
          <Table
            columns={[
              {
                key: "examName",
                dataIndex: "examName",
                title: "考试",
              },
              {
                key: "score",
                dataIndex: "score",
                title: "评分",
                sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0),
              },
              {
                key: "action",
                title: "操作",
                render: (_, record) => (
                  <Button
                    type="link"
                    onClick={() => {
                      router.push(`/exam/${record.examID}`);
                    }}
                  >
                    查看考试
                  </Button>
                ),
              },
            ]}
            dataSource={examScoresDataSource}
          />
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

const TeacherGradeReports: React.FC = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { data: homeworkTotalData } = useSWR<
    JsonResponse<HomeworkTotalScore[]>
  >(`/api/homework/grade/${coid}`);
  const homeworkTotalDataSource = homeworkTotalData?.result.map((item) => ({
    key: item.studentID,
    ...item,
  }));

  const { data: examTotalData } = useSWR<JsonResponse<ExamTotalScore[]>>(
    `/api/exam/grade/${coid}`
  );
  const examTotalDataSource = examTotalData?.result.map((item) => ({
    key: item.studentID,
    ...item,
  }));

  return (
    <>
      <Title level={2}>作业</Title>
      {homeworkTotalData && homeworkTotalData.code === 0 ? (
        <>
          <Table
            columns={[
              {
                key: "studentName",
                dataIndex: "studentName",
                title: "学生姓名",
              },
              {
                key: "completionRate",
                dataIndex: "completionRate",
                title: "完成率",
                render: (_, record) =>
                  `${(record.completionRate * 100).toFixed(2)}%`,
                sorter: (a, b) => a.completionRate - b.completionRate,
              },
              {
                key: "averageScore",
                dataIndex: "averageScore",
                title: "平均分",
                render: (_, record) => (+record.averageScore).toFixed(2),
                sorter: (a, b) => a.averageScore - b.averageScore,
              },
            ]}
            dataSource={homeworkTotalDataSource}
          />
        </>
      ) : (
        <Skeleton active />
      )}
      <Title level={2}>考试</Title>
      {examTotalData && examTotalData.code === 0 ? (
        <>
          <Table
            columns={[
              {
                key: "studentName",
                dataIndex: "studentName",
                title: "学生姓名",
              },
              {
                key: "averageScore",
                dataIndex: "averageScore",
                title: "平均分",
                render: (_, record) => (+record.averageScore).toFixed(2),
                sorter: (a, b) => a.averageScore - b.averageScore,
              },
            ]}
            dataSource={examTotalDataSource}
          />
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default CourseGradePage;
