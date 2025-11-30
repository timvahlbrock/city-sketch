import { Card } from "antd";
import ClientVisionSelection from "@/app/components/visionSelection/clientVisionSelection";
import CreateVisionButton from "@/app/components/visionSelection/createVisionButton";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function VisionSelection() {
  const visions = await fetchQuery(api.visions.getAll);

  return (
    <Card
      title={
        <div style={{ display: "flex" }}>
          <span style={{ flexGrow: 1 }}>Visions</span>
          <CreateVisionButton />
        </div>
      }
    >
      <ClientVisionSelection visions={visions} />
    </Card>
  );
}
