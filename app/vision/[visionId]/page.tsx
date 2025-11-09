import { fetchSections } from "@/app/queries/fetchSections";
import { Card, Space, Tag } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";

export default async function Page({
  params,
}: {
  params: { visionId: string };
}) {
  const visionId = parseInt(params.visionId);
  const vision = await fetchVision(visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Link href={"/"} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <h1 style={{ fontWeight: "bold", fontSize: "x-large" }}>
          {vision.title}
        </h1>
        <Card title={"Description"}>
          {vision.description || "No description provided."}
        </Card>
        <Card title={`Sections (${sections.length})`}>
          {sections.map((section) => {
            return (
              <Tag
                key={section.id}
                color={"blue"}
                style={{
                  width: "100%",
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  display: "flex",
                }}
                closable={true}
              >
                Section {section.id}
                <span style={{ flexGrow: 1 }} />
              </Tag>
            );
          })}
        </Card>
      </Space>
    </>
  );
}
