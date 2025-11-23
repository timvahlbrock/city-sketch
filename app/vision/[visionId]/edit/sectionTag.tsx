"use client";

import { Popconfirm, Tag } from "antd";
import { Section as SectionModel } from "@/app/contexts/editor/editorState";
import { useContext, useState } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";
import useClient from "@/app/hooks/useClient";

export default function SectionTag({ section }: { section: SectionModel }) {
  const client = useClient();
  const [tagVisible, setTagVisible] = useState(true);
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const editorContext = useContext(EditorContext);

  async function deleteSection(sectionId: number) {
    await client.from("sections").delete().eq("id", sectionId).single();
  }

  return (
    tagVisible && (
      <Popconfirm
        title={"Delete section?"}
        key={section.id}
        open={popConfirmOpen}
        onCancel={() => setPopConfirmOpen(false)}
        onConfirm={async () => {
          await deleteSection(section.id);
          editorContext.removeSections([section.id]);
          setPopConfirmOpen(false);
          setTagVisible(false);
        }}
        placement="topRight"
      >
        <Tag
          color={"blue"}
          style={{
            width: "100%",
            marginBottom: "0.75rem",
            padding: "0.25rem",
            display: "flex",
          }}
          closable={true}
          onClose={async (e) => {
            e.preventDefault();
            setPopConfirmOpen(true);
          }}
        >
          Section {section.id}
          <span style={{ flexGrow: 1 }} />
        </Tag>
      </Popconfirm>
    )
  );
}
