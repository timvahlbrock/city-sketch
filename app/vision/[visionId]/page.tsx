import { Button, Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { fetchVision } from "@/app/queries/fetchVision";
import VisionDescription from "@/app/components/visionDescription";

export default async function VisionPage({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const vision = await fetchVision(visionId);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Link href={"/"} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <h1 style={{ fontWeight: "bold", fontSize: "x-large" }}>
            {vision.title}
          </h1>
          <VisionDescription vision={vision} />
        </Space>
        You&#39;ll probably be able to discuss this vision here in the future.
        <div style={{ flexGrow: 1 }}></div>
        <Link href={`/vision/${visionId}/edit`} style={{ width: "100%" }}>
          <Button icon={<EditOutlined />} style={{ width: "100%" }}>
            Edit
          </Button>
        </Link>
      </Space>
    </>
  );
}
