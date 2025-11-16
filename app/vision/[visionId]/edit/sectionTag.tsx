import { Tag } from "antd";
import { Section as SectionModel } from "@/app/contexts/editor/editorState";

export default function SectionTag({ section }: { section: SectionModel }) {
  return (
    <Tag
      key={section.id}
      color={"blue"}
      style={{
        width: "100%",
        marginBottom: "0.75rem",
        padding: "0.25rem",
        display: "flex",
      }}
      closable={true}
    >
      Section {section.id}
      <span style={{ flexGrow: 1 }} />
    </Tag>
  );
}
