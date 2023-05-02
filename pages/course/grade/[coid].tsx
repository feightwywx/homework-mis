import { NextPage } from "next";
import HwLayout from "../../../components/layout";
import useUser from "../../../utils/hooks/useUser";
import useSWR from "swr";
import {
  Course,
  Exam,
  ExamAssginRequestBody,
  ExamContentScore,
  Homework,
  HomeworkContentScore,
  HomeworkDetail,
  HomeworkStudentDetail,
  JsonResponse,
  StudentHomework,
} from "../../../utils/types";
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
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { CourseCard } from "../../../components/CourseCard";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { HomeworkCard } from "../../../components/HomeworkCard";
import { ExamCard } from "../../../components/ExamCard";
import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { RangePickerProps } from "antd/lib/date-picker";
import parseMysqlDateTime from "../../../utils/parseTime";
import Link from "next/link";

const { Text, Title } = Typography;

const CourseIndexPage: NextPage = () => {
  const router = useRouter();
  const { coid } = router.query;

  const { user } = useUser();

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

            {user.userType === "student" && (
              <>
                <Title level={2}>作业</Title>
                {homeworkScoresData && homeworkScoresData.code === 0 ? (
                  <>
                    <Space direction="horizontal">
                      <Text>
                        完成率：
                        {(
                          (homeworkScoresData.result.filter(
                            (item) => item.completed
                          ).length /
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
                            .reduce((a, b) => a + b) /
                          homeworkScoresData.result.length
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
                        },
                        {
                          key: "score",
                          dataIndex: "score",
                          title: "评分",
                        },
                        {
                          key: "action",
                          title: "操作",
                          render: (_, record) => (
                            <Button
                              type="link"
                              onClick={() => {
                                router.push(
                                  `/homeworkDetail/${record.homeworkID}`
                                );
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
                            .reduce((a, b) => a + b) /
                          examScoresData.result.length
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
                        },
                        {
                          key: "action",
                          title: "操作",
                          render: (_, record) => (
                            <Button
                              type="link"
                              onClick={() => {
                                router.push(`/homeworkDetail/${record.examID}`);
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
            )}
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

export default CourseIndexPage;
