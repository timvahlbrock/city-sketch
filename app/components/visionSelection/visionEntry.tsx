import Link from "next/link";
import { BulbOutlined, RightOutlined } from "@ant-design/icons";
import { List } from "antd";
import { Vision } from "@/app/components/visionSelection/vision";

export default function VisionEntry({ vision }: { vision: Vision }) {
  return (
    <Link href={`/vision/${vision.id}`}>
      <List.Item style={{ justifyContent: "start" }}>
        <div style={{ fontSize: "xx-large", flexGrow: 0, marginRight: 16 }}>
          <BulbOutlined />
        </div>
        <div style={{ flexGrow: "1" }}>
          <h1>
            <b>{vision.title}</b>
          </h1>
          <p>{vision.description}</p>
        </div>
        <RightOutlined style={{ fontSize: "xx-large" }} />
      </List.Item>
    </Link>
  );
}
