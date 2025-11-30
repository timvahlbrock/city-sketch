import FlyIntoBounds from "@/app/@map/components/FlyIntoBounds";
import { fetchBounds } from "@/app/queries/fetchBounds";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ClientSections from "@/app/@map/components/clientSections";

export default async function Page({
  params,
}: {
  params: Promise<{ sketchId: Id<"sketches"> }>;
}) {
  const sketchId = (await params).sketchId;
  const preloadedSections = await preloadQuery(api.sections.forSketch, {
    sketchId,
  });
  const bounds = await fetchBounds(sketchId);

  return (
    <>
      <FlyIntoBounds sketchId={sketchId} bounds={bounds} />
      <ClientSections preloadedSections={preloadedSections} />
    </>
  );
}
