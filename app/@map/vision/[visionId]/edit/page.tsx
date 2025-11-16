import { fetchSections } from "@/app/queries/fetchSections";
import ClientSections from "@/app/components/map/clientSections";
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
          sectionId={section.id}
          key={section.id}
          editable={true}
        />
      ))}
      <ClientSections serverSections={sections} />
    </>
  );
}
