import { Card } from "antd";
import { createSsrClient } from "@/app/utils/createSsrClient";
import ClientVisionSelection from "@/app/components/visionSelection/clientVisionSelection";

export default async function VisionSelection() {
  const visions = await fetchVisions();

  return (
    <Card title="Visions">
      <ClientVisionSelection visions={visions} />
    </Card>
  );
}

async function fetchVisions() {
  const client = await createSsrClient();

  return (
    await client
      .from("visions")
      .select("id, title, description, implementationState")
      .throwOnError()
  ).data;
}
