import { Section } from "@/app/components/map/section";
import { fetchSections } from "@/app/queries/fetchSections";
import FlyIntoBounds from "@/app/components/map/FlyIntoBounds";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      <FlyIntoBounds visionId={visionId} />
      {sections.map((section) => (
        <Section key={section.id} sectionId={section.id} />
      ))}
    </>
  );
}
