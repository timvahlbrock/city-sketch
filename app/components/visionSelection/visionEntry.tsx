import Link from "next/link";
import { BulbOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { Doc } from "@/convex/_generated/dataModel";

export default function VisionEntry({ vision }: { vision: Doc<"visions"> }) {
  return (
    <Link href={`/vision/${vision._id}`}>
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              size={50}
              icon={<BulbOutlined />}
              style={{ backgroundColor: "white", color: "black" }}
            />
          }
          title={vision.title}
          description={vision.description}
        />
        <RightOutlined
          style={{ fontSize: "large", color: "rgba(0, 0, 0, 0.45)" }}
        />
      </List.Item>
    </Link>
  );
}
