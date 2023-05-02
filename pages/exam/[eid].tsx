import { NextPage } from "next";
import { useRouter } from "next/router";
import HwLayout from "../../components/layout";
import {
  Typography,
  Space,
  Button,
  Divider,
  Tag,
  Modal,
  Table,
  Form,
  InputNumber,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useUser from "../../utils/hooks/useUser";
import {
  Exam,
  ExamResult,
  JsonResponse,
} from "../../utils/types";
import React, { useState } from "react";
import useSWR from "swr";
import parseMysqlDateTime from "../../utils/parseTime";
import { ColumnsType } from "antd/lib/table";

const { Title, Text } = Typography;

function ExamDetailPage() {
  const router = useRouter();
  const { eid } = router.query;

  const { user } = useUser();

  const { data: examDetailData } = useSWR(`/api/exam/detail/${eid}`);

  const examDetail = (examDetailData as JsonResponse<Exam>)?.result;

  return (
    <HwLayout>
      {eid && examDetailData && examDetail ? (
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
            <Title style={{ float: "left" }}>{examDetail.name}</Title>
          </div>
          <Space direction="vertical" size="small">
            <Title level={2}>考试信息</Title>
            <Text>
              开始时间：{parseMysqlDateTime(examDetail.time).toLocaleString()}
            </Text>
            <Text>
              结束时间：
              {parseMysqlDateTime(examDetail.endtime).toLocaleString()}
            </Text>
            <Text>考试地点：{examDetail.location}</Text>
          </Space>
          <Divider />
          {user?.userType === "student" && <StudentExamScore eid={+eid} />}
          {user?.userType === "teacher" && <TeacherUploadScore eid={+eid} />}
        </Space>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning></Spin>
        </div>
      )}
    </HwLayout>
  );
}

export const StudentExamScore: React.FC<{ eid: number }> = ({ eid }) => {
  const { data: scoreData } = useSWR(`/api/exam/score/${eid}`);
  const score = (scoreData as JsonResponse<number | undefined>)?.result;

  return (
    <>
      <Title level={2}>考试成绩</Title>
      {score ? (
        <>
          <Text style={{ float: "right", fontSize: 18 }}>/100</Text>
          <Text
            style={{ float: "right", fontSize: 18 }}
            type={score >= 60 ? "success" : "danger"}
          >
            {score}
          </Text>
        </>
      ) : (
        <Text>暂时没有成绩。</Text>
      )}
    </>
  );
};

export const TeacherUploadScore: React.FC<{ eid: number }> = ({ eid }) => {
  type TableDataType = {
    id: number;
    name: string;
    judged: boolean;
    score: number | null;
  };

  const [messageApi, messageContext] = message.useMessage();

  const { data: examScoresData, mutate: mutateExamScores } = useSWR<
    JsonResponse<ExamResult[]>
  >(`/api/exam/score/${eid}`);
  const examScores = examScoresData?.result;
  const examScoresDataSource: TableDataType[] | undefined = examScores?.map(
    (item) => ({
      id: item.id,
      name: item.studentName,
      judged: !!item.score,
      score: item.score,
    })
  );

  const [judgeModalOpen, setJudgeModalOpen] = useState(false);
  const [confirmJudgeLoading, setConfirmJudgeLoading] = useState(false);
  const [currentResultID, setCurrentResultID] = useState(0);

  const [judgeForm] = Form.useForm();

  const judgeFormSubmitHandler = async (values: { score: number }) => {
    setConfirmJudgeLoading(true);

    try {
      const submitResponse = await fetch(`/api/exam/judge/${currentResultID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: values.score,
        }),
      });
      const submitResponseJson = (await submitResponse.json()) as
        | JsonResponse<number>
        | undefined;
      if (submitResponseJson) {
        if (submitResponseJson.code === 0) {
          messageApi.success("已提交");
          mutateExamScores();
          setJudgeModalOpen(false);
        } else {
          messageApi.error(`未知错误：${submitResponseJson.code}`);
        }
      }
    } catch (e) {
      if ((e as Error).message === "Failed to fetch") {
        messageApi.error("网络错误");
      } else {
        messageApi.error("遇到了未知错误");
      }
    } finally {
      setConfirmJudgeLoading(false);
    }
  };

  return (
    <>
      {messageContext}
      <Title level={2}>成绩录入</Title>
      <Table
        dataSource={examScoresDataSource}
        columns={
          [
            // { title: "id", dataIndex: "id", key: "id" },
            {
              title: "姓名",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "评分状态",
              dataIndex: "judged",
              key: "judged",
              render: (_, record) =>
                record.judged ? (
                  <Tag color="green">已评分</Tag>
                ) : (
                  <Tag>未评分</Tag>
                ),
              filters: [
                {
                  text: "已评分",
                  value: true,
                },
                {
                  text: "未评分",
                  value: false,
                },
              ],
              onFilter: (value: boolean, record) => value === record.judged,
            },
            {
              title: "成绩",
              dataIndex: "score",
              key: "score",
            },
            {
              title: "操作",
              key: "action",
              render: (_, record) => (
                <Space size="small">
                  <Button
                    type="link"
                    onClick={() => {
                      setJudgeModalOpen(true);
                      setCurrentResultID(record.id);
                    }}
                  >
                    录入成绩
                  </Button>
                </Space>
              ),
            },
          ] as ColumnsType<TableDataType>
        }
      />
      <Modal
        open={judgeModalOpen}
        title="提交分数"
        onCancel={() => {
          setJudgeModalOpen(false);
        }}
        confirmLoading={confirmJudgeLoading}
        onOk={() => {
          judgeForm.submit();
        }}
      >
        <Form form={judgeForm} onFinish={judgeFormSubmitHandler}>
          <Form.Item
            label="得分"
            name="score"
            rules={[
              {
                required: true,
                message: "请输入得分！",
              },
              {
                type: "number",
                min: 0,
                max: 100,
                message: "得分需要在0～100之间！",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExamDetailPage as NextPage;
