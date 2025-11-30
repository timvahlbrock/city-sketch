import { Button, Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import SketchDescription from "@/app/@sidebar/components/sketchDescription";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import SketchTitle from "@/app/@sidebar/components/sketchTitle";

export default async function SketchPage({
  params,
}: {
  params: Promise<{ sketchId: Id<"sketches"> }>;
}) {
  const sketchId = (await params).sketchId;
  const sketch = await preloadQuery(api.sketches.get, { sketchId });

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Link href={"/"} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <SketchTitle preloadedSketch={sketch} />
          <SketchDescription preloadedSketch={sketch} />
        </Space>
        You&#39;ll probably be able to discuss this sketch here in the future.
        <div style={{ flexGrow: 1 }}></div>
        <Link href={`/sketch/${sketchId}/edit`} style={{ width: "100%" }}>
          <Button icon={<EditOutlined />} style={{ width: "100%" }}>
            Edit
          </Button>
        </Link>
      </Space>
    </>
  );
}
