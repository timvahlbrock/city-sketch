import { Section } from "@/app/components/map/section";
import { fetchSections } from "@/app/queries/fetchSections";

export default async function Page({
  params,
}: {
  params: { visionId: string };
}) {
  const visionId = parseInt(params.visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} sectionId={section.id} />
      ))}
    </>
  );
}
