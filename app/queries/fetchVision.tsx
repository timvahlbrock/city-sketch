import { createSsrClient } from "@/app/utils/createSsrClient";

export async function fetchVision(visionId: number) {
  const client = await createSsrClient();

  const response = await client
    .from("visions")
    .select("*")
    .eq("id", visionId)
    .single()
    .throwOnError();
  return response.data;
}
