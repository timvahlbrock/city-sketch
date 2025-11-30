import { Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import VisionDescription from "@/app/components/visionDescription";
import VisionTitle from "@/app/components/visionTitle";
import EditorControls from "@/app/components/visionEditor/editorControls";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: Id<"visions"> }>;
}) {
  const visionId = (await params).visionId;
  const vision = await preloadQuery(api.visions.get, { visionId });

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Link href={`/vision/${visionId}`} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <VisionTitle preloadedVision={vision} editable={true} />
          <VisionDescription preloadedVision={vision} editable={true} />
        </Space>
        <EditorControls visionId={visionId} />
      </Space>
    </>
  );
}
