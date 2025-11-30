"use client";

import { List } from "antd";
import SketchEntry from "@/app/@sidebar/components/sketchSelection/sketchEntry";
import { Doc } from "@/convex/_generated/dataModel";

export interface ClientSketchSelectionProps {
  sketches: Doc<"sketches">[];
}

export default function ClientSketchSelection({
  sketches,
}: ClientSketchSelectionProps) {
  return (
    <List>
      {sketches.map((sketch) => (
        <SketchEntry key={sketch._id} sketch={sketch} />
      ))}
    </List>
  );
}
