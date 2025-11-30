import { fetchSections } from "@/app/queries/fetchSections";
import { EditableSection } from "@/app/components/map/editableSection";
import { Id } from "@/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = (await params).visionId as Id<"visions">;
  const sections = await fetchSections(visionId);

  return (
    <>
      {sections.map((section) => (
        <EditableSection
          key={section!._id}
          sectionId={section!._id}
          editable={true}
        />
      ))}
    </>
  );
}
