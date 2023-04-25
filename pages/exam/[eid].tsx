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
  Input,
  Table,
  Form,
  InputNumber,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined, FormOutlined } from "@ant-design/icons";
import { useMediaPredicate } from "react-media-hook";
import useUser from "../../utils/hooks/useUser";
import {
  Exam,
  HomeworkDetail,
  HomeworkDetailContent,
  HomeworkStudentDetail,
  HomeworkTeacherDetail,
  HomeworkTeacherDetailContent,
  JsonResponse,
} from "../../utils/types";
import React, { useState } from "react";
import useSWR from "swr";
import parseMysqlDateTime from "../../utils/parseTime";
import { ColumnsType } from "antd/lib/table";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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
  console.log("frontend score: ", score);

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
  return (
    <>
      <Title level={2}>成绩录入</Title>
    </>
  );
};

export default ExamDetailPage as NextPage;
