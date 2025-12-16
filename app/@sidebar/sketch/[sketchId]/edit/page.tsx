import { Space } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SketchDescription from "@/app/@sidebar/components/sketchDescription";
import SketchTitle from "@/app/@sidebar/components/sketchTitle";
import EditorControls from "@/app/@sidebar/components/sketchEditor/editorControls";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Page({
  params,
}: {
  params: Promise<{ sketchId: Id<"sketches"> }>;
}) {
  const sketchId = (await params).sketchId;
  const sketch = await preloadQuery(api.sketches.get, { sketchId });

  return (
    <>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Link href={`/sketch/${sketchId}`} style={{ color: "gray" }}>
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </Link>
        <Space orientation="vertical" size="small" style={{ width: "100%" }}>
          <SketchTitle preloadedSketch={sketch} editable={true} />
          <SketchDescription preloadedSketch={sketch} editable={true} />
        </Space>
        <EditorControls sketchId={sketchId} />
      </Space>
    </>
  );
}
