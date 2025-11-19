import { fetchSections } from "@/app/queries/fetchSections";
import ClientSections from "@/app/components/map/clientSections";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: string }>;
}) {
  const visionId = parseInt((await params).visionId);
  const sections = await fetchSections(visionId);

  return (
    <>
      <ClientSections serverSections={sections} />
    </>
  );
}
