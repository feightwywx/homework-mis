import { NextPage } from "next";
import HwLayout from "../../components/layout";
import useUser from "../../utils/hooks/useUser";
import useSWR from "swr";
import { Course, JsonResponse } from "../../utils/types";
import { Space, Spin, Typography } from "antd";
import { ProTable } from "@ant-design/pro-components";

const { Title } = Typography;

function CourseIndexPage() {
  const { user } = useUser();

  const { data } = useSWR(`/api/course/${user?.userType}/my`);
  const courses = (data as JsonResponse<Course[]>)?.result;

  return (
    <HwLayout>
      {courses ? (
        <>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div>
              <Title>所有课程</Title>
            </div>
          </Space>
        </>
      ) : (
        <div style={{ margin: "32px", textAlign: "center" }}>
          <Spin spinning={!courses}></Spin>
        </div>
      )}
      <ProTable
        // @ts-expect-error
        request={async () => {
          const msg = await fetch("/api/course/all");
          return {
            data: ((await msg.json()) as JsonResponse).result,
            success: true,
          };
        }}
        columns={[
          {
            title: "ID",
            key: "id",
            dataIndex: "id",
          },
          {
            title: "课程名称",
            key: "name",
            dataIndex: "name",
          },
        ]}
        search={false}
      />
    </HwLayout>
  );
}

export default CourseIndexPage as NextPage;
