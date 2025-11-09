"use client";

import { Card, List, Typography } from "antd";
import { useVisions } from "@/app/hooks/visions";
import { BulbOutlined, RightOutlined } from "@ant-design/icons";

export default function VisionSelection() {
  const visions = useVisions();

  return (
    <Card title="Visions">
      <List
        dataSource={visions}
        renderItem={(item) => (
          <List.Item style={{ justifyContent: "start" }}>
            <div style={{ fontSize: "xx-large", flexGrow: 0, marginRight: 16 }}>
              <BulbOutlined />
            </div>
            <div style={{ flexGrow: "1" }}>
              <h1>
                <b>{item.title}</b>
              </h1>
              <p>{item.description}</p>
            </div>
            <RightOutlined style={{ fontSize: "xx-large" }} />
          </List.Item>
        )}
      />
    </Card>
  );
}
