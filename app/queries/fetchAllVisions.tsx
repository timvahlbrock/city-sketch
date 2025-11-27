import { createSsrClient } from "@/app/utils/createSsrClient";

export async function fetchAllVisions() {
  const client = await createSsrClient();

  return (
    await client
      .from("visions")
      .select("id, title, description, implementationState")
      .throwOnError()
  ).data;
}
