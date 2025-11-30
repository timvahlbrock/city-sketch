import { EditableSection } from "@/app/components/map/editableSection";
import { fetchSections } from "@/app/queries/fetchSections";
import FlyIntoBounds from "@/app/components/map/FlyIntoBounds";
import { fetchBounds } from "@/app/queries/fetchBounds";
import { Id } from "@/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = (await params).visionId as Id<"visions">;
  const sections = await fetchSections(visionId);
  const bounds = await fetchBounds(visionId);

  return (
    <>
      <FlyIntoBounds visionId={visionId} bounds={bounds} />
      {sections.map((section) => (
        <EditableSection
          key={section._id}
          sectionId={section._id}
          editable={false}
        />
      ))}
    </>
  );
}
