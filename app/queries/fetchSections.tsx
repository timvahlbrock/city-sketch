import { createSsrClient } from "@/app/utils/createSsrClient";

export async function fetchSections(visionId: number) {
  const client = await createSsrClient();

  const response = await client
    .from("visions")
    .select("sections(*)")
    .eq("id", visionId)
    .single()
    .throwOnError();
  return response.data.sections;
}
