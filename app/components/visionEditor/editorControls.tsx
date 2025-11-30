"use client";

import { useContext } from "react";
import AddSectionButton from "@/app/components/visionEditor/addSectionButton";
import { Button, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import EditorContext from "@/app/contexts/editorContext/editorContext";
import { Id } from "@/convex/_generated/dataModel";

export interface EditorControlsProps {
  visionId: Id<"visions">;
}

export default function EditorControls({ visionId }: EditorControlsProps) {
  const { state, setState } = useContext(EditorContext);

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          icon={<PlusOutlined />}
          style={{ width: "100%" }}
          onClick={() =>
            setState(
              state?.stateType == "addingNode"
                ? null
                : { stateType: "addingNode" },
            )
          }
          color={state?.stateType == "addingNode" ? "orange" : "blue"}
          variant="solid"
        >
          Add Node
        </Button>
        <Button
          icon={<DeleteOutlined />}
          style={{ width: "100%" }}
          onClick={() =>
            setState(
              state?.stateType == "removeSection"
                ? null
                : { stateType: "removeSection" },
            )
          }
          color={state?.stateType == "removeSection" ? "orange" : "blue"}
          variant="solid"
        >
          Delete Section
        </Button>
        <AddSectionButton visionId={visionId} />
      </Space>
    </>
  );
}
