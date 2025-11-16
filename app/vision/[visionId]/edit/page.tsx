import { Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";
import { fetchSections } from "@/app/queries/fetchSections";
import AddSectionButton from "@/app/components/visionEditor/addSectionButton";
import ClientSections from "@/app/vision/[visionId]/edit/clientSections";

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
          <ClientSections serverSections={sections} />
          <AddSectionButton visionId={visionId} />
        </div>
      </Space>
    </>
  );
}
