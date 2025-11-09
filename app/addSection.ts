"use server";
import { createSsrClient } from "@/app/utils/createSsrClient";

export async function addSection() {
  const client = await createSsrClient();

  const insertedData = await client
    .from("sections")
    .insert({})
    .select("id")
    .single();
  return insertedData.data?.id;
}
