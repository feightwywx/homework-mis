import { Col, Divider, Row, Skeleton, Space, Spin, Typography } from "antd";
import HwLayout from "./layout";
import useUser from "../utils/hooks/useUser";
import { useStudentHomework } from "../utils/hooks/useHomework";
import parseMysqlDateTime from "../utils/parseTime";
import { HomeworkCard } from "./HomeworkCard";
import useSWR from "swr";
import { Exam, JsonResponse } from "../utils/types";
import { ExamCard } from "./ExamCard";

const { Text, Title } = Typography;

export function StudentHome(): JSX.Element {
  const { user } = useUser();

  const { homework } = useStudentHomework();

  const { data: examData } = useSWR<JsonResponse<Exam[]>>(`/api/exam/my`);
  const exam = examData?.result;

  const currtime = new Date(Date.now());
  const hour = currtime.getHours();

  const futureExams = exam?.filter(
    (item) => parseMysqlDateTime(item.time) > currtime
  );

  return (
    <HwLayout>
      {!user && (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin></Spin>
        </div>
      )}

      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Title style={{ marginBottom: "16px" }}>
          {hour < 5
            ? "夜深了"
            : hour < 9
            ? "早上好"
            : hour < 12
            ? "上午好"
            : hour < 14
            ? "中午好"
            : hour < 18
            ? "下午好"
            : hour < 22
            ? "晚上好"
            : "夜深了"}
          ，{user?.name}同学
        </Title>
        <Title level={2}>作业</Title>
        {homework ? (
          <>
            <Title level={4} style={{ marginTop: 0 }}>
              {(() => {
                const filtered = homework?.filter(
                  (item) => currtime <= parseMysqlDateTime(item.deadline)
                );
                if (
                  filtered &&
                  filtered.length !== 0 &&
                  filtered.length -
                    filtered.filter((x) => x.completed).length !==
                    0
                ) {
                  return `目前还有${
                    filtered.length - filtered.filter((x) => x.completed).length
                  }项作业需要完成，加油！`;
                } else {
                  return "目前没有要完成的作业哦，过段时间再来看看吧～";
                }
              })()}
            </Title>
            <Row gutter={16}>
              {(() => {
                const filtered = homework?.filter(
                  (item) =>
                    currtime <= parseMysqlDateTime(item.deadline) &&
                    !item.completed
                );
                return filtered?.length ? (
                  filtered.map((item, index) => (
                    <Col xs={24} md={12} xl={8} key={index}>
                      <HomeworkCard homework={item} withBottom />
                    </Col>
                  ))
                ) : (
                  <></>
                );
              })()}
            </Row>
          </>
        ) : (
          <Skeleton active />
        )}
        <Title level={2}>考试</Title>
        {exam && futureExams ? (
          <>
            <Title level={4} style={{ marginTop: 0 }}>
              {futureExams.length
                ? `最近有${futureExams.length}场考试，认真准备吧。`
                : `最近没有考试～`}
            </Title>
            <Row gutter={16}>
              {futureExams.map((exam, index) => (
                <Col xs={24} md={12} xl={8} key={index}>
                  <ExamCard exam={exam} withBottom />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Skeleton active />
        )}
      </Space>
    </HwLayout>
  );
}
