import { fetchSections } from "@/app/queries/fetchSections";
import { EditableSection } from "@/app/components/map/editableSection";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      {sections.map((section) => (
        <EditableSection
          key={section.id}
          sectionId={section.id}
          editable={true}
        />
      ))}
    </>
  );
}
