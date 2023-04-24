import { Avatar, Card, Divider, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import parseMysqlDateTime from "../utils/parseTime";
import { Exam, Homework, StudentHomework } from "../utils/types";
import Link from "next/link";

const { Text } = Typography;

export function ExamCard({ exam }: { exam: Exam }): JSX.Element {
  const time = parseMysqlDateTime(exam.time);
  const endtime = parseMysqlDateTime(exam.endtime);

  return (
    <Card
      title={exam.name}
      extra={<Link href={`/exam/${exam.id}`}>查看</Link>}
      style={{ marginBottom: 16, display: "block" }}
    >
      <Text>开始时间：{time.toLocaleString()}</Text>
      <br />
      <Text>结束时间：{endtime.toLocaleString()}</Text>
      <br />
      <Text>考试地点：{exam.location}</Text>
    </Card>
  );
}
