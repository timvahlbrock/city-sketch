import { Card } from "antd";
import ClientVisionSelection from "@/app/components/visionSelection/clientVisionSelection";
import CreateVisionButton from "@/app/components/visionSelection/createVisionButton";
import { fetchAllVisions } from "@/app/queries/fetchAllVisions";

export default async function VisionSelection() {
  const visions = await fetchAllVisions();

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
