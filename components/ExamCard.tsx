import { Button, Card, Divider, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import parseMysqlDateTime from "../utils/parseTime";
import { Exam } from "../utils/types";
import Link from "next/link";
import { useRouter } from "next/router";

const { Text } = Typography;

export const ExamCard: React.FC<{ exam: Exam; withBottom?: boolean }> = ({
  exam,
  withBottom,
}) => {
  const router = useRouter();

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
      {withBottom && (
        <>
          <Divider style={{ margin: "16px 0px" }} />
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ flex: 1 }} />
            <Button
              type="link"
              size="small"
              onClick={() => router.push(`/exam/${exam.courseID}`)}
            >
              {exam.courseName}
              <RightOutlined />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
