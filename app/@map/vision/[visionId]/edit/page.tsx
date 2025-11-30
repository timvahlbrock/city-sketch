import { api } from "@/convex/_generated/api";
import { fetchBounds } from "@/app/queries/fetchBounds";
import ClientSections from "@/app/@map/components/clientSections";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

export default async function Page({
  params,
}: {
  params: Promise<{ visionId: Id<"visions"> }>;
}) {
  const visionId = (await params).visionId;
  const preloadedSections = await preloadQuery(api.sections.forVision, {
    visionId,
  });
  const bounds = await fetchBounds(visionId);

  return (
    <>
      <ClientSections preloadedSections={preloadedSections} editable={true} />
    </>
  );
}
