import { Vision } from "@/app/components/visionSelection/vision";

export interface Section {
  id: number;
  // nodes: number[];
}

export interface RankedNode {
  id: number;
  latitude: number;
  longitude: number;
  rank: number;
}

export interface EditorState {
  updatedVisions: ReadonlyMap<number, Vision>;
  updateVision: (vision: Vision) => void;
  addedSections: ReadonlyMap<number, Section>;
  addSections: (newSections: Section[]) => void;
  removedSections: ReadonlySet<number>;
  removeSections: (removedSectionIds: number[]) => void;
  addedNodes: ReadonlyMap<number, ReadonlyMap<number, RankedNode>>;
  addNodes: (sectionId: number, newNodes: RankedNode[]) => void;
  removedNodes: ReadonlyMap<number, ReadonlySet<number>>;
  removeNodes: (sectionId: number, removedNodeIds: number[]) => void;
  updatedNodes: ReadonlyMap<number, ReadonlyMap<number, RankedNode>>;
  updateNodes: (sectionId: number, updatedNodes: RankedNode[]) => void;
}
