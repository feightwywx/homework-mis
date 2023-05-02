import { Button, Card, Divider, Tag, Typography } from "antd";
import parseMysqlDateTime from "../utils/parseTime";
import { Course } from "../utils/types";
import React from "react";

const { Text, Title } = Typography;

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const time = parseMysqlDateTime(course.time);

  return (
    <Card
      style={{ marginBottom: 16, display: "block" }}
    >
      <Title level={3}>
        {course.name}
        {course.ended && (
          <Tag
            style={{
              marginLeft: 8,
              verticalAlign: "middle",
            }}
          >
            已过期
          </Tag>
        )}
      </Title>
      <Text>发布时间：{time.toLocaleString()}</Text>
      <br />
      <Text>指导教师：{course.teacherName}</Text><br />
      <Divider />
      <Button type="primary" href={`/course/${course.id}`}>查看</Button>
    </Card>
  );
};
