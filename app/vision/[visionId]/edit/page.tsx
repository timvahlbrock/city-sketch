import { Space, Tag } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";
import { fetchSections } from "@/app/queries/fetchSections";
import AddSectionButton from "@/app/components/visionEditor/addSectionButton";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const vision = await fetchVision(visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Link href={`/vision/${visionId}`} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <h1 style={{ fontWeight: "bold", fontSize: "x-large" }}>
          Editing: {vision.title}
        </h1>
        <div>
          <h2 style={{ fontWeight: "bold", fontSize: "large" }}>Sections</h2>
          {sections.map((section) => {
            return (
              <Tag
                key={section.id}
                color={"blue"}
                style={{
                  width: "100%",
                  marginBottom: "0.75rem",
                  padding: "0.25rem",
                  display: "flex",
                }}
                closable={true}
              >
                Section {section.id}
                <span style={{ flexGrow: 1 }} />
              </Tag>
            );
          })}
          <AddSectionButton visionId={visionId} />
        </div>
      </Space>
    </>
  );
}
