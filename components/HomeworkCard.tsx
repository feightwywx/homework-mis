import { Avatar, Button, Card, Divider, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { UserOutlined, RightOutlined } from "@ant-design/icons";
import parseMysqlDateTime from "../utils/parseTime";
import { Homework, StudentHomework } from "../utils/types";
import Link from "next/link";
import { useRouter } from "next/router";

const { Text } = Typography;

export function HomeworkCard({
  homework,
  withBottom,
  noTeacherName,
}: {
  homework: Homework | StudentHomework;
  withBottom?: boolean;
  noTeacherName?: boolean;
}): JSX.Element {
  const router = useRouter();

  const time = parseMysqlDateTime(homework.time);
  const deadline = parseMysqlDateTime(homework.deadline);
  const currtime = new Date(Date.now());

  return (
    <Card
      title={
        <>
          {homework.title}
          {((homework as StudentHomework).completed && (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{
                marginLeft: 8,
                verticalAlign: "middle",
              }}
            >
              已完成
            </Tag>
          )) ||
            (currtime > deadline && (
              <Tag
                style={{
                  marginLeft: 8,
                  verticalAlign: "middle",
                }}
              >
                已过期
              </Tag>
            ))}
        </>
      }
      extra={<Link href={`/homeworkDetail/${homework.id}`}>查看</Link>}
      style={{ marginBottom: 16, display: "block" }}
    >
      <Text>发布时间：{time.toLocaleString()}</Text>
      <br />
      <Text>截止时间：{deadline.toLocaleString()}</Text>
      {withBottom && (
        <>
          <Divider style={{ margin: "16px 0px" }} />
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ flex: 1 }}>
              {!noTeacherName && (
                <>
                  <Avatar
                    size={"small"}
                    icon={<UserOutlined />}
                    style={{ marginTop: -4 }}
                  />
                  <Text style={{ marginLeft: 12 }}>
                    <b>{homework.teacher}</b>布置的作业
                  </Text>
                </>
              )}
            </div>
            <Button
              type="link"
              size="small"
              onClick={() => router.push(`/course/${homework.courseID}`)}
            >
              {homework.courseName}
              <RightOutlined />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
