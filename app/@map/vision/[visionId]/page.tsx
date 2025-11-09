import { Section } from "@/app/components/map/section";
import { createSsrClient } from "@/app/utils/createSsrClient";

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

async function fetchSections(visionId: number) {
  const client = await createSsrClient();

  const response = await client
    .from("visions")
    .select("sections(*)")
    .eq("id", visionId)
    .single()
    .throwOnError();
  return response.data.sections;
}
