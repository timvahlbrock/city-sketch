import FlyIntoBounds from "@/app/@map/components/FlyIntoBounds";
import { fetchBounds } from "@/app/queries/fetchBounds";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ClientSections from "@/app/@map/components/clientSections";

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
      <FlyIntoBounds visionId={visionId} bounds={bounds} />
      <ClientSections preloadedSections={preloadedSections} />
    </>
  );
}
