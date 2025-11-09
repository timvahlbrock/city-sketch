import { Section } from "@/app/components/map/section";
import { createClient } from "@/app/utils";

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
  const client = await createClient();

  const response = await client
    .from("visions")
    .select("sections(*)")
    .eq("id", visionId)
    .single()
    .throwOnError();
  return response.data.sections;
}
