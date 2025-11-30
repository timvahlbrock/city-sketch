import { Card } from "antd";
import ClientSketchSelection from "@/app/components/sketchSelection/clientSketchSelection";
import CreateSketchButton from "@/app/components/sketchSelection/createSketchButton";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function SketchSelection() {
  const sketches = await fetchQuery(api.sketches.getAll);

  return (
    <Card
      title={
        <div style={{ display: "flex" }}>
          <span style={{ flexGrow: 1 }}>Sketches</span>
          <CreateSketchButton />
        </div>
      }
    >
      <ClientSketchSelection sketches={sketches} />
    </Card>
  );
}
