import { api } from "@/convex/_generated/api";
import { fetchBounds } from "@/app/queries/fetchBounds";
import ClientSections from "@/app/@map/components/clientSections";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

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
      <ClientSections preloadedSections={preloadedSections} editable={true} />
    </>
  );
}
