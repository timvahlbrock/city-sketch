import { Database } from "@/app/database.types";
import { useEffect, useState } from "react";
import { createFrontendClient } from "@/app/createFrontendClient";

export type Section = Database["public"]["Tables"]["sections"]["Row"];

export function useSections(visionId: number) {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetchSections(visionId).then(setSections);
  }, [visionId]);

  return sections;
}

async function fetchSections(visionId: number) {
  const client = createFrontendClient();

  const response = await client
    .from("visions")
    .select("sections(*)")
    .eq("id", visionId)
    .single()
    .throwOnError();
  return response.data.sections;
}
