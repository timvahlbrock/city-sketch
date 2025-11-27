import { EditableSection } from "@/app/components/map/editableSection";
import { fetchSections } from "@/app/queries/fetchSections";
import FlyIntoBounds from "@/app/components/map/FlyIntoBounds";
import { fetchBounds } from "@/app/queries/fetchBounds";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const sections = await fetchSections(visionId);
  const bounds = await fetchBounds(visionId);

  return (
    <>
      <FlyIntoBounds visionId={visionId} bounds={bounds} />
      {sections.map((section) => (
        <EditableSection
          key={section.id}
          sectionId={section.id}
          editable={false}
        />
      ))}
    </>
  );
}
