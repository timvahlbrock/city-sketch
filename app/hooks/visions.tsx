import { Database } from "@/app/database.types";
import { useEffect, useState } from "react";
import { createFrontendClient } from "@/app/createFrontendClient";

export type Vision = Database["public"]["Tables"]["visions"]["Row"];

export function useVisions() {
  const [visions, setVisions] = useState<Vision[]>([]);

  useEffect(() => {
    fetchVisions().then(setVisions);
  }, []);

  return visions;
}

async function fetchVisions() {
  const client = createFrontendClient();

  return (
    await client
      .from("visions")
      .select("id, title, description, implementationState")
      .throwOnError()
  ).data;
}
