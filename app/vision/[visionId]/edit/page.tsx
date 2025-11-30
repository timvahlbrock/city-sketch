import { Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";
import VisionDescription from "@/app/components/visionDescription";
import VisionTitle from "@/app/components/visionTitle";
import EditorControls from "@/app/components/visionEditor/editorControls";
import { Id } from "@/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = (await params).visionId as Id<"visions">;
  const vision = await fetchVision(visionId);

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
        <EditorControls visionId={visionId} />
      </Space>
    </>
  );
}
