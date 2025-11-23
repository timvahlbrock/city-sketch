import { Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";
import { fetchSections } from "@/app/queries/fetchSections";
import AddSectionButton from "@/app/components/visionEditor/addSectionButton";
import Sections from "@/app/vision/[visionId]/edit/sections";
import VisionDescription from "@/app/components/visionDescription";
import VisionTitle from "@/app/components/visionTitle";

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
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <VisionTitle vision={vision} editable={true} />
          <VisionDescription vision={vision} editable={true} />
        </Space>
        <div>
          <h2 style={{ fontWeight: "bold", fontSize: "large" }}>Sections</h2>
          <Sections serverSections={sections} />
          <AddSectionButton visionId={visionId} />
        </div>
      </Space>
    </>
  );
}
