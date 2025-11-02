"use server";
import { createClient } from "@/app/utils";

export async function addSection() {
  const client = await createClient();

  const insertedData = await client
    .from("sections")
    .insert({})
    .select("id")
    .single();
  return insertedData.data?.id;
}
