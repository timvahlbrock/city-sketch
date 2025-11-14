import { Section } from "@/app/components/map/section";
import { fetchSections } from "@/app/queries/fetchSections";

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
        <Section key={section.id} sectionId={section.id} />
      ))}
    </>
  );
}
