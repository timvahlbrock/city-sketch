import Link from "next/link";
import { BulbOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { Doc } from "@/convex/_generated/dataModel";

export default function SketchEntry({ sketch }: { sketch: Doc<"sketches"> }) {
  return (
    <Link href={`/sketch/${sketch._id}`}>
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              size={50}
              icon={<BulbOutlined />}
              style={{ backgroundColor: "white", color: "black" }}
            />
          }
          title={sketch.title}
          description={sketch.description}
        />
        <RightOutlined
          style={{ fontSize: "large", color: "rgba(0, 0, 0, 0.45)" }}
        />
      </List.Item>
    </Link>
  );
}
